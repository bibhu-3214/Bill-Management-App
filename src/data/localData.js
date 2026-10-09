import { createDemoWorkspace } from './demoWorkspace';
import { calculateInvoice, financialYear, validDate, validGSTIN, paymentSummary, today, paise, states } from '../utils/indiaBilling';

const DEMO_DATABASE_KEY = 'billflow:demo:v1';
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

const bytesToBase64 = bytes => {
    let binary = '';
    for (let offset = 0; offset < bytes.length; offset += 8192) binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192));
    return btoa(binary);
};
const base64ToBytes = value => Uint8Array.from(atob(value), character => character.charCodeAt(0));

const createId = prefix => `${prefix}_${bytesToBase64(randomBytes(16)).replace(/[^a-z0-9]/gi, '')}`;
const emptyDatabase = () => ({ users: [], workspaces: {} });

const readDatabase = () => {
    try {
        const stored = sessionStorage.getItem(DEMO_DATABASE_KEY) || localStorage.getItem(DATABASE_KEY);
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

const writeDatabase = database => {
    if (sessionStorage.getItem(DEMO_DATABASE_KEY)) {
        sessionStorage.setItem(DEMO_DATABASE_KEY, JSON.stringify(database));
    } else {
        localStorage.setItem(DATABASE_KEY, JSON.stringify(database));
    }
};

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

const decryptPayload = async (encryptedWorkspace, keyBytes) => {
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
        return JSON.parse(decoder.decode(plaintext));
    } catch (error) {
        throw new Error('The encrypted data could not be opened. Check your password and backup file.');
    }
};

const decryptWorkspace = async (encryptedWorkspace, keyBytes) => {
    const workspace = await decryptPayload(encryptedWorkspace, keyBytes);
    return {
        customers: Array.isArray(workspace.customers) ? workspace.customers : [],
        products: Array.isArray(workspace.products) ? workspace.products : [],
        bills: Array.isArray(workspace.bills) ? workspace.bills : [],
        invoiceSequences: workspace.invoiceSequences || {},
        settings: workspace.settings || {},
    };
};

const clearSession = () => {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(DEMO_DATABASE_KEY);
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

let mutationQueue = Promise.resolve();
const mutateWorkspace = async updater => {
    const database = readDatabase();
    const session = await requireSession(database);
    const result = updater(session.workspace, session.user);
    database.workspaces[session.user._id] = await encryptWorkspace(session.workspace, session.keyBytes);
    writeDatabase(database);
    return result;
};

const updateWorkspace = updater => {
    const run = () => mutateWorkspace(updater);
    const operation = mutationQueue.then(() => navigator.locks ? navigator.locks.request('billflow-write', run) : run());
    mutationQueue = operation.catch(() => {});
    return operation;
};

const productDefaults = values => {
    const hsn = String(values.hsn || '').trim();
    const gstRate = values.gstRate === '' || values.gstRate == null ? '' : Number(values.gstRate);
    if (hsn && !/^\d{4,8}$/.test(hsn)) throw new Error('HSN/SAC must contain 4–8 digits.');
    if (gstRate !== '' && (!Number.isFinite(gstRate) || gstRate < 0 || gstRate > 40)) throw new Error('GST rate must be between 0 and 40.');
    return { hsn, gstRate, unit: cleanText(values.unit || 'NOS', 'Unit', 12), sku: optionalText(values.sku, 'SKU', 60), category: optionalText(values.category, 'Category', 80), description: optionalText(values.description, 'Description', 1000) };
};

const optionalText = (value, field, length) => value ? cleanText(value, field, length) : '';
const customerDefaults = values => {
    const gstin = String(values.gstin || '').trim().toUpperCase();
    const state = values.state || '';
    if (state && !states[state]) throw new Error('Select a valid state.');
    if (gstin && (!validGSTIN(gstin) || gstin.slice(0, 2) !== state)) throw new Error('GSTIN must be valid and match the selected state.');
    return { company: optionalText(values.company, 'Company', 120), contactPerson: optionalText(values.contactPerson, 'Contact person', 120),
        address: optionalText(values.address, 'Billing address', 500), notes: optionalText(values.notes, 'Notes', 1000), state, gstin };
};

const BACKUP_LIMIT = 20 * 1024 * 1024;
const openBackup = async (text, password) => {
    if (typeof text !== 'string' || text.length > BACKUP_LIMIT) throw new Error('Backup must be a BillFlow JSON file under 20 MB.');
    let backup;
    try { backup = JSON.parse(text); } catch { throw new Error('Invalid backup JSON.'); }
    if (backup?.format !== 'billflow-encrypted-backup' || backup.version !== 1 || typeof backup.salt !== 'string' ||
        !/^[A-Za-z0-9+/]{22}==$/.test(backup.salt) || backup.payload?.version !== 2 ||
        typeof backup.payload.iv !== 'string' || !/^[A-Za-z0-9+/]{16}$/.test(backup.payload.iv) ||
        typeof backup.payload.ciphertext !== 'string') throw new Error('Unsupported or damaged backup.');
    if (!password) throw new Error('Enter the password used when this backup was created.');
    const credentials = await deriveCredentials(password, base64ToBytes(backup.salt));
    const { profile, workspace, createdAt } = await decryptPayload(backup.payload, credentials.encryptionKey);
    if (!profile || typeof profile._id !== 'string' || typeof profile.email !== 'string' || !profile.email.includes('@') ||
        !workspace || !['customers', 'products', 'bills'].every(key => Array.isArray(workspace[key])) ||
        typeof createdAt !== 'string') throw new Error('Backup contents are invalid.');
    for (const key of ['customers', 'products', 'bills']) {
        const ids = new Set();
        for (const record of workspace[key]) {
            if (!record || typeof record._id !== 'string' || ids.has(record._id)) throw new Error('Backup contains invalid or duplicate records.');
            ids.add(record._id);
        }
    }
    const user = { _id: profile._id, email: normalizeEmail(profile.email), username: cleanText(profile.username, 'Name', 80),
        businessName: cleanText(profile.businessName, 'Business name'), address: cleanText(profile.address, 'Address', 240),
        passwordSalt: backup.salt, passwordVerifier: bytesToBase64(credentials.verifier), authVersion: AUTH_VERSION,
        failedAttempts: 0, lockedUntil: 0, createdAt: profile.createdAt };
    return { user, workspace, credentials, createdAt };
};

const localData = {
    async exportBackup() {
        const { user, workspace, keyBytes } = await requireSession(readDatabase());
        if (user.isDemo) throw new Error('Sample workspaces cannot be backed up. Create a local account to use encrypted backups.');
        const payload = await encryptWorkspace({ profile: publicUser(user), workspace, createdAt: new Date().toISOString() }, keyBytes);
        return JSON.stringify({ format: 'billflow-encrypted-backup', version: 1, salt: user.passwordSalt, payload });
    },

    async previewBackup(text, password) {
        const { user, workspace, createdAt } = await openBackup(text, password);
        return { email: user.email, businessName: user.businessName, createdAt,
            customers: workspace.customers.length, products: workspace.products.length, invoices: workspace.bills.length };
    },

    async restoreBackup(text, password) {
        const recovered = await openBackup(text, password);
        const run = async () => {
            const database = readDatabase();
            if (database.users.some(user => user._id === recovered.user._id || user.email === recovered.user.email)) {
                throw new Error('This account already exists here. Restore in a separate browser profile; existing accounts are never overwritten.');
            }
            database.users.push(recovered.user);
            database.workspaces[recovered.user._id] = await encryptWorkspace(recovered.workspace, recovered.credentials.encryptionKey);
            writeDatabase(database);
            return recovered.user.email;
        };
        const operation = mutationQueue.then(() => navigator.locks ? navigator.locks.request('billflow-write', run) : run());
        mutationQueue = operation.catch(() => {});
        return operation;
    },
    async getSettings() {
        const { workspace, user } = await requireSession(readDatabase());
        return { name: user.businessName, address: user.address, gstin: '', state: '', terms: '', dueDays: 0, bankDetails: '', logo: '', ...workspace.settings };
    },

    async saveSettings(values) {
        return updateWorkspace(workspace => {
            const gstin = String(values.gstin || '').trim().toUpperCase();
            if (gstin && (!validGSTIN(gstin) || gstin.slice(0, 2) !== values.state)) throw new Error('GSTIN must be valid and match the selected state.');
            if (values.state && !states[values.state]) throw new Error('Select a valid state.');
            const dueDays = Number(values.dueDays);
            if (!Number.isInteger(dueDays) || dueDays < 0 || dueDays > 365) throw new Error('Payment term must be 0–365 days.');
            const logo = String(values.logo || '');
            if (logo && (!/^data:image\/(png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(logo) || logo.length > 180000)) throw new Error('Use a PNG or JPEG logo under 130 KB.');
            workspace.settings = { name: cleanText(values.name, 'Business name'), address: cleanText(values.address, 'Address', 500), gstin,
                state: values.state || '', dueDays, terms: String(values.terms || '').slice(0, 1000), bankDetails: String(values.bankDetails || '').slice(0, 500), logo };
            return workspace.settings;
        });
    },
    hasActiveSession() {
        return Boolean(readSession());
    },

    clearSession,

    async openDemo() {
        if (readSession()) throw new Error('Sign out before opening the sample workspace.');
        const key = randomBytes(32);
        const user = {
            _id: 'demo_user', username: 'Alex', email: 'alex@example.com',
            businessName: 'Studio North — Sample', address: 'Fictional workspace · India', isDemo: true,
        };
        const workspace = await encryptWorkspace(createDemoWorkspace(), key);
        try {
            sessionStorage.setItem(DEMO_DATABASE_KEY, JSON.stringify({ users: [user], workspaces: { [user._id]: workspace } }));
            createSession(user._id, key);
        } catch (error) {
            clearSession();
            throw error;
        }
        return { user };
    },

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
                ...customerDefaults(values),
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
                ...workspace.customers[index],
                _id: id,
                name: cleanText(values.name, 'Customer name', 100),
                email: normalizeEmail(values.email),
                mobile: cleanText(values.mobile, 'Phone number', 20),
                ...customerDefaults({ ...workspace.customers[index], ...values }),
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
            const product = { _id: createId('product'), name: cleanText(values.name, 'Product name'), price, ...productDefaults(values) };
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
            workspace.products[index] = { ...workspace.products[index], name: cleanText(values.name, 'Product name'), price, ...productDefaults({ ...workspace.products[index], ...values }) };
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
        return updateWorkspace((workspace, user) => {
            const date = values.date?.slice(0, 10);
            const fy = financialYear(date);
            if (values.dueDate && (!validDate(values.dueDate) || values.dueDate < date)) throw new Error('Due date must be on or after the invoice date.');
            const gst = Boolean(values.gst);
            const supplierGSTIN = String(values.supplierGSTIN || '').trim().toUpperCase();
            const customerGSTIN = String(values.customerGSTIN || '').trim().toUpperCase();
            if (gst && (!validGSTIN(supplierGSTIN) || supplierGSTIN.slice(0, 2) !== values.supplierState)) throw new Error('Enter a valid supplier GSTIN matching the supplier state.');
            if (gst && customerGSTIN && !validGSTIN(customerGSTIN)) throw new Error('Customer GSTIN is invalid.');
            const billingAddress = cleanText(values.billingAddress, 'Billing address', 500);
            if (!workspace.customers.some(customer => customer._id === values.customer)) {
                throw new Error('The selected customer is unavailable.');
            }
            const lineItems = (values.lineItems || []).map(item => {
                const product = workspace.products.find(record => record._id === item.product);
                const quantity = Number(item.quantity);
                if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 10000) {
                    throw new Error('One of the invoice items is invalid.');
                }
                const price = Number(product.price);
                if (gst && !/^\d{4,8}$/.test(item.hsn || '')) throw new Error('Enter a 4–8 digit HSN/SAC for each item.');
                return {
                    _id: createId('item'),
                    product: product._id,
                    name: product.name,
                    hsn: String(item.hsn || '').slice(0, 8),
                    unit: cleanText(item.unit || 'NOS', 'Unit', 12),
                    discount: item.discount || 0,
                    gstRate: item.gstRate,
                    quantity,
                    price,
                    subTotal: price * quantity,
                };
            });
            if (!lineItems.length) throw new Error('Add at least one invoice item.');
            const totals = calculateInvoice(lineItems, values);
            workspace.invoiceSequences = workspace.invoiceSequences || {};
            const sequence = Number(workspace.invoiceSequences[fy] || 0) + 1;
            if (sequence > 999999) throw new Error('Invoice series is exhausted.');
            workspace.invoiceSequences[fy] = sequence;
            const bill = {
                ...totals,
                _id: createId('invoice'),
                invoiceNumber: `BF/${fy}/${String(sequence).padStart(6, '0')}`,
                date,
                dueDate: values.dueDate || date,
                gst,
                supplierState: values.supplierState || '',
                placeOfSupply: values.placeOfSupply || '',
                supplierSnapshot: { name: user.businessName, address: user.address, ...workspace.settings, gstin: gst ? supplierGSTIN : '' },
                customerSnapshot: { ...workspace.customers.find(record => record._id === values.customer), address: billingAddress, gstin: gst ? customerGSTIN : '' },
                notes: String(values.notes || '').trim().slice(0, 1000),
                payments: [],
                customer: values.customer,
                createdAt: new Date().toISOString(),
            };
            workspace.bills.push(bill);
            return bill;
        });
    },

    async recordPayment(id, values) {
        return updateWorkspace(workspace => {
            const bill = workspace.bills.find(record => record._id === id);
            if (!bill) throw new Error('Invoice not found.');
            if (bill.cancellation || bill.creditNote) throw new Error('This invoice is closed.');
            const amount = Number(values.amount);
            if (!Number.isFinite(amount) || paise(amount) <= 0 || paise(amount) > paise(paymentSummary(bill).balance)) throw new Error('Payment must be positive and cannot exceed the balance.');
            if (!validDate(values.date) || values.date < bill.date.slice(0, 10) || values.date > today()) throw new Error('Payment date must be between invoice date and today.');
            if (!['UPI', 'Bank transfer', 'Cash', 'Card', 'Cheque'].includes(values.method)) throw new Error('Choose a payment method.');
            bill.payments = [...(bill.payments || []), { _id: createId('payment'), amount: paise(amount) / 100, date: values.date,
                method: values.method, reference: String(values.reference || '').trim().slice(0, 120), createdAt: new Date().toISOString() }];
            return bill;
        });
    },

    async correctInvoice(id, values) {
        return updateWorkspace((workspace, user) => {
            const bill = workspace.bills.find(record => record._id === id);
            if (!bill) throw new Error('Invoice not found.');
            const reason = cleanText(values.reason, 'Correction reason', 500);
            const event = { _id: createId('event'), reason, date: today(), createdAt: new Date().toISOString(), actor: user.username };
            if (values.action === 'reverse') {
                const payment = (bill.payments || []).find(p => p._id === values.paymentId);
                if (!payment || (bill.reversals || []).some(r => r.paymentId === payment._id)) throw new Error('Payment is missing or already reversed.');
                bill.reversals = [...(bill.reversals || []), { ...event, paymentId: payment._id, amount: payment.amount }];
            } else {
                if (bill.cancellation || bill.creditNote) throw new Error('This invoice is already closed.');
                if (paymentSummary(bill).paid > 0) throw new Error('Active payments remain. A refund must be handled outside BillFlow before reversing the payment record and closing the invoice.');
                if (bill.date.slice(0, 10) > today()) throw new Error('Cannot correct a future-dated invoice.');
                if (values.action === 'cancel') bill.cancellation = event;
                else if (values.action === 'credit') {
                    if (!bill.invoiceNumber) throw new Error('Credit notes require a numbered invoice.');
                    const fy = financialYear(today());
                    const key = 'CN' + fy;
                    const sequence = Number(workspace.invoiceSequences[key] || 0) + 1;
                    if (sequence > 999999) throw new Error('Credit note series exhausted.');
                    workspace.invoiceSequences[key] = sequence;
                    bill.creditNote = { ...event, number: `CN/${fy}/${String(sequence).padStart(6, '0')}`, amount: bill.total,
                        taxable: bill.taxable, cgst: bill.cgst, stateTax: bill.stateTax, igst: bill.igst };
                } else throw new Error('Invalid correction action.');
            }
            return bill;
        });
    },

    async removeBill(id) {
        return updateWorkspace(workspace => {
            const bill = workspace.bills.find(record => record._id === id);
            if (!bill) throw new Error('Invoice not found.');
            if (bill.invoiceNumber || bill.payments?.length || bill.cancellation || bill.creditNote || bill.reversals?.length) throw new Error('Issued invoices and payment records cannot be deleted.');
            workspace.bills = workspace.bills.filter(record => record._id !== id);
            return bill;
        });
    },
};

export default localData;
