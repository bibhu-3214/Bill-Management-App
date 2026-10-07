const DATABASE_KEY = 'billflow:database:v1';
const SESSION_KEY = 'billflow:session:v2';
const AUTH_VERSION = 2;
const PASSWORD_ITERATIONS = 310000;
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_DURATION_MS = 5 * 60 * 1000;
const encoder = new TextEncoder();
const decoder = new TextDecoder();

const requireWebCrypto = () => {
    if (!window.crypto || !window.crypto.subtle) {
        throw new Error('This browser does not support secure local encryption.');
    }
};

const randomBytes = length => {
    requireWebCrypto();
    return window.crypto.getRandomValues(new Uint8Array(length));
};

const bytesToBase64 = bytes => btoa(String.fromCharCode(...bytes));
const base64ToBytes = value => Uint8Array.from(atob(value), character => character.charCodeAt(0));

const createId = prefix => `${prefix}_${bytesToBase64(randomBytes(16)).replace(/[^a-z0-9]/gi, '')}`;
const emptyDatabase = () => ({ users: [], workspaces: {} });

const readDatabase = () => {
    try {
        const stored = localStorage.getItem(DATABASE_KEY);
        if (!stored) return emptyDatabase();

        const database = JSON.parse(stored);
        return {
            users: Array.isArray(database.users) ? database.users : [],
            workspaces: database.workspaces || {},
        };
    } catch (error) {
        throw new Error('The local workspace is damaged and could not be opened.');
    }
};

const writeDatabase = database => localStorage.setItem(DATABASE_KEY, JSON.stringify(database));

const deriveCredentials = async (password, salt) => {
    requireWebCrypto();
    const material = await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits'],
    );
    const bits = await window.crypto.subtle.deriveBits(
        { name: 'PBKDF2', salt, iterations: PASSWORD_ITERATIONS, hash: 'SHA-256' },
        material,
        512,
    );
    const bytes = new Uint8Array(bits);
    return { verifier: bytes.slice(0, 32), encryptionKey: bytes.slice(32, 64) };
};

const legacyPasswordHash = async password => {
    const digest = await window.crypto.subtle.digest('SHA-256', encoder.encode(password));
    return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
};

const safelyEqual = (left, right) => {
    if (left.length !== right.length) return false;
    let difference = 0;
    for (let index = 0; index < left.length; index += 1) difference |= left[index] ^ right[index];
    return difference === 0;
};

const importEncryptionKey = keyBytes =>
    window.crypto.subtle.importKey('raw', keyBytes, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);

const encryptWorkspace = async (workspace, keyBytes) => {
    const key = await importEncryptionKey(keyBytes);
    const iv = randomBytes(12);
    const ciphertext = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encoder.encode(JSON.stringify(workspace)),
    );
    return { version: 2, iv: bytesToBase64(iv), ciphertext: bytesToBase64(new Uint8Array(ciphertext)) };
};

const decryptWorkspace = async (encryptedWorkspace, keyBytes) => {
    if (!encryptedWorkspace || encryptedWorkspace.version !== 2) {
        throw new Error('This workspace must be unlocked again.');
    }
    try {
        const key = await importEncryptionKey(keyBytes);
        const plaintext = await window.crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: base64ToBytes(encryptedWorkspace.iv) },
            key,
            base64ToBytes(encryptedWorkspace.ciphertext),
        );
        const workspace = JSON.parse(decoder.decode(plaintext));
        return {
            customers: Array.isArray(workspace.customers) ? workspace.customers : [],
            products: Array.isArray(workspace.products) ? workspace.products : [],
            bills: Array.isArray(workspace.bills) ? workspace.bills : [],
        };
    } catch (error) {
        throw new Error('The encrypted workspace could not be opened. Please sign in again.');
    }
};

const clearSession = () => {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('token');
};

const readSession = () => {
    try {
        const session = JSON.parse(sessionStorage.getItem(SESSION_KEY));
        if (!session || !session.userId || !session.workspaceKey || Date.now() >= session.expiresAt) {
            clearSession();
            return null;
        }
        return session;
    } catch (error) {
        clearSession();
        return null;
    }
};

const createSession = (userId, encryptionKey) => {
    sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
            userId,
            workspaceKey: bytesToBase64(encryptionKey),
            token: bytesToBase64(randomBytes(32)),
            expiresAt: Date.now() + SESSION_DURATION_MS,
        }),
    );
    localStorage.removeItem('token');
};

const publicUser = user => {
    const {
        passwordHash,
        passwordSalt,
        passwordVerifier,
        failedAttempts,
        lockedUntil,
        authVersion,
        ...safeUser
    } = user;
    return safeUser;
};

const normalizeEmail = email => email.trim().toLowerCase();
const cleanText = (value, field, maximumLength = 120) => {
    const cleaned = String(value || '').trim();
    if (!cleaned || cleaned.length > maximumLength) throw new Error(`${field} is invalid.`);
    return cleaned;
};

const requireSession = async database => {
    const session = readSession();
    if (!session) throw new Error('Your secure session has expired. Please sign in again.');
    const user = database.users.find(record => record._id === session.userId);
    if (!user) throw new Error('Your secure session is no longer valid.');
    const keyBytes = base64ToBytes(session.workspaceKey);
    const workspace = await decryptWorkspace(database.workspaces[user._id], keyBytes);
    return { user, workspace, keyBytes };
};

const updateWorkspace = async updater => {
    const database = readDatabase();
    const session = await requireSession(database);
    const result = updater(session.workspace);
    database.workspaces[session.user._id] = await encryptWorkspace(session.workspace, session.keyBytes);
    writeDatabase(database);
    return result;
};

const localData = {
    hasActiveSession() {
        return Boolean(readSession());
    },

    clearSession,

    async register(values) {
        const database = readDatabase();
        const email = normalizeEmail(values.email);
        if (database.users.some(user => user.email === email)) {
            throw new Error('An account with this email already exists.');
        }

        const salt = randomBytes(16);
        const credentials = await deriveCredentials(values.password, salt);
        const user = {
            _id: createId('user'),
            username: cleanText(values.username, 'Name', 80),
            email,
            passwordSalt: bytesToBase64(salt),
            passwordVerifier: bytesToBase64(credentials.verifier),
            authVersion: AUTH_VERSION,
            businessName: cleanText(values.businessName, 'Business name', 120),
            address: cleanText(values.address, 'Address', 240),
            failedAttempts: 0,
            lockedUntil: 0,
            createdAt: new Date().toISOString(),
        };

        database.users.push(user);
        database.workspaces[user._id] = await encryptWorkspace(
            { customers: [], products: [], bills: [] },
            credentials.encryptionKey,
        );
        writeDatabase(database);
        return publicUser(user);
    },

    async login({ email, password }) {
        const database = readDatabase();
        const user = database.users.find(record => record.email === normalizeEmail(email));
        const fallbackSalt = new Uint8Array(16);
        const salt = user && user.passwordSalt ? base64ToBytes(user.passwordSalt) : fallbackSalt;
        let credentials = await deriveCredentials(password, salt);
        let passwordMatches = false;

        if (user && user.authVersion === AUTH_VERSION && user.passwordVerifier) {
            passwordMatches = safelyEqual(credentials.verifier, base64ToBytes(user.passwordVerifier));
        } else if (user && user.passwordHash) {
            passwordMatches = safelyEqual(
                encoder.encode(await legacyPasswordHash(password)),
                encoder.encode(user.passwordHash),
            );
        }

        if (!user || !passwordMatches || Number(user.lockedUntil || 0) > Date.now()) {
            if (user) {
                user.failedAttempts = Number(user.failedAttempts || 0) + 1;
                if (user.failedAttempts >= MAX_LOGIN_ATTEMPTS) {
                    user.lockedUntil = Date.now() + LOCK_DURATION_MS;
                    user.failedAttempts = 0;
                }
                writeDatabase(database);
            }
            throw new Error('The credentials are incorrect or sign-in is temporarily locked.');
        }

        if (user.authVersion !== AUTH_VERSION) {
            const upgradedSalt = randomBytes(16);
            credentials = await deriveCredentials(password, upgradedSalt);
            user.passwordSalt = bytesToBase64(upgradedSalt);
            user.passwordVerifier = bytesToBase64(credentials.verifier);
            user.authVersion = AUTH_VERSION;
            delete user.passwordHash;
            database.workspaces[user._id] = await encryptWorkspace(
                database.workspaces[user._id] || { customers: [], products: [], bills: [] },
                credentials.encryptionKey,
            );
        }

        user.failedAttempts = 0;
        user.lockedUntil = 0;
        writeDatabase(database);
        createSession(user._id, credentials.encryptionKey);
        return { user: publicUser(user) };
    },

    getCurrentUser() {
        const session = readSession();
        if (!session) throw new Error('Your secure session has expired.');
        const user = readDatabase().users.find(record => record._id === session.userId);
        if (!user) throw new Error('Your secure session is no longer valid.');
        return publicUser(user);
    },

    async getCustomers() {
        return [...(await requireSession(readDatabase())).workspace.customers];
    },

    async addCustomer(values) {
        return updateWorkspace(workspace => {
            const customer = {
                _id: createId('customer'),
                name: cleanText(values.name, 'Customer name', 100),
                email: normalizeEmail(values.email),
                mobile: cleanText(values.mobile, 'Phone number', 20),
            };
            workspace.customers.push(customer);
            return customer;
        });
    },

    async editCustomer(id, values) {
        return updateWorkspace(workspace => {
            const index = workspace.customers.findIndex(customer => customer._id === id);
            if (index < 0) throw new Error('Customer not found.');
            workspace.customers[index] = {
                _id: id,
                name: cleanText(values.name, 'Customer name', 100),
                email: normalizeEmail(values.email),
                mobile: cleanText(values.mobile, 'Phone number', 20),
            };
            return workspace.customers[index];
        });
    },

    async removeCustomer(id) {
        return updateWorkspace(workspace => {
            if (workspace.bills.some(bill => bill.customer === id)) {
                throw new Error('This customer is used by an invoice and cannot be deleted.');
            }
            const customer = workspace.customers.find(record => record._id === id);
            if (!customer) throw new Error('Customer not found.');
            workspace.customers = workspace.customers.filter(record => record._id !== id);
            return customer;
        });
    },

    async getProducts() {
        return [...(await requireSession(readDatabase())).workspace.products];
    },

    async addProduct(values) {
        return updateWorkspace(workspace => {
            const price = Number(values.price);
            if (!Number.isFinite(price) || price <= 0) throw new Error('Price must be a positive number.');
            const product = { _id: createId('product'), name: cleanText(values.name, 'Product name'), price };
            workspace.products.push(product);
            return product;
        });
    },

    async editProduct(id, values) {
        return updateWorkspace(workspace => {
            const index = workspace.products.findIndex(product => product._id === id);
            if (index < 0) throw new Error('Product not found.');
            const price = Number(values.price);
            if (!Number.isFinite(price) || price <= 0) throw new Error('Price must be a positive number.');
            workspace.products[index] = { _id: id, name: cleanText(values.name, 'Product name'), price };
            return workspace.products[index];
        });
    },

    async removeProduct(id) {
        return updateWorkspace(workspace => {
            if (workspace.bills.some(bill => bill.lineItems.some(item => item.product === id))) {
                throw new Error('This product is used by an invoice and cannot be deleted.');
            }
            const product = workspace.products.find(record => record._id === id);
            if (!product) throw new Error('Product not found.');
            workspace.products = workspace.products.filter(record => record._id !== id);
            return product;
        });
    },

    async getBills() {
        return [...(await requireSession(readDatabase())).workspace.bills];
    },

    async getBill(id) {
        const bill = (await requireSession(readDatabase())).workspace.bills.find(record => record._id === id);
        if (!bill) throw new Error('Invoice not found.');
        return bill;
    },

    async addBill(values) {
        return updateWorkspace(workspace => {
            if (!workspace.customers.some(customer => customer._id === values.customer)) {
                throw new Error('The selected customer is unavailable.');
            }
            const lineItems = values.lineItems.map(item => {
                const product = workspace.products.find(record => record._id === item.product);
                const quantity = Number(item.quantity);
                if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 10000) {
                    throw new Error('One of the invoice items is invalid.');
                }
                const price = Number(product.price);
                return {
                    _id: createId('item'),
                    product: product._id,
                    quantity,
                    price,
                    subTotal: price * quantity,
                };
            });
            if (!lineItems.length) throw new Error('Add at least one invoice item.');
            const bill = {
                _id: createId('invoice'),
                date: new Date(values.date).toISOString(),
                customer: values.customer,
                lineItems,
                total: lineItems.reduce((sum, item) => sum + item.subTotal, 0),
                createdAt: new Date().toISOString(),
            };
            workspace.bills.push(bill);
            return bill;
        });
    },

    async removeBill(id) {
        return updateWorkspace(workspace => {
            const bill = workspace.bills.find(record => record._id === id);
            if (!bill) throw new Error('Invoice not found.');
            workspace.bills = workspace.bills.filter(record => record._id !== id);
            return bill;
        });
    },
};

export default localData;
