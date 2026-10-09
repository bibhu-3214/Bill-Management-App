const { TextDecoder, TextEncoder } = require('util');
const { webcrypto } = require('crypto');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
Object.defineProperty(window, 'crypto', { configurable: true, value: webcrypto });

const localData = require('./localData').default;

describe('secure local data', () => {
    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
    });

    test('demo edits are isolated from persistent accounts and reset after sign-out', async () => {
        const original = JSON.stringify({ users: [], workspaces: {} });
        localStorage.setItem('billflow:database:v1', original);
        await localData.openDemo();
        expect(localData.getCurrentUser().isDemo).toBe(true);
        expect(await localData.getCustomers()).toHaveLength(3);
        expect(await localData.getBills()).toHaveLength(6);
        await localData.addProduct({ name: 'Demo-only product', price: 25 });
        expect(await localData.getProducts()).toHaveLength(5);
        expect(localStorage.getItem('billflow:database:v1')).toBe(original);
        localData.clearSession();
        expect(sessionStorage.getItem('billflow:demo:v1')).toBeNull();
        await localData.openDemo();
        expect(await localData.getProducts()).toHaveLength(4);
    });

    test('invoice snapshots retain their price after catalog edits', async () => {
        await localData.openDemo();
        const product = await localData.addProduct({ name: 'Workshop', price: 125 });
        const customer = (await localData.getCustomers())[0];
        const bill = await localData.addBill({ date: '2026-10-09', customer: customer._id,
            lineItems: [{ product: product._id, quantity: 3 }] });
        await localData.editProduct(product._id, { name: 'Workshop', price: 200 });
        expect((await localData.getBill(bill._id)).total).toBe(375);
        await expect(localData.removeProduct(product._id)).rejects.toThrow('used by an invoice');
        await expect(localData.removeCustomer(customer._id)).rejects.toThrow('used by an invoice');
    });

    test('invalid quantities cannot create invoices', async () => {
        await localData.openDemo();
        const customer = (await localData.getCustomers())[0];
        const product = (await localData.getProducts())[0];
        for (const quantity of [0, -1, 1.5, 10001]) {
            await expect(localData.addBill({ date: '2026-10-09', customer: customer._id,
                lineItems: [{ product: product._id, quantity }] })).rejects.toThrow('invalid');
        }
        expect(await localData.getBills()).toHaveLength(6);
    });

    test('expired demo sessions reject workspace access', async () => {
        await localData.openDemo();
        const session = JSON.parse(sessionStorage.getItem('billflow:session:v2'));
        session.expiresAt = Date.now() - 1;
        sessionStorage.setItem('billflow:session:v2', JSON.stringify(session));
        await expect(localData.getProducts()).rejects.toThrow('expired');
        expect(localData.hasActiveSession()).toBe(false);
    });

    test('encrypts workspace data and creates an expiring session', async () => {
        const password = 'StrongLocal#123';
        await localData.register({
            username: 'Test User',
            email: 'test@example.com',
            password,
            businessName: 'Test Business',
            address: 'Test Address',
        });

        const storedDatabase = JSON.parse(localStorage.getItem('billflow:database:v1'));
        const user = storedDatabase.users[0];
        expect(user.passwordHash).toBeUndefined();
        expect(user.passwordSalt).toBeTruthy();
        expect(user.passwordVerifier).toBeTruthy();
        expect(storedDatabase.workspaces[user._id]).toEqual(
            expect.objectContaining({ version: 2, iv: expect.any(String), ciphertext: expect.any(String) }),
        );
        expect(JSON.stringify(storedDatabase.workspaces[user._id])).not.toContain('customers');

        await localData.login({ email: 'test@example.com', password });
        expect(localData.hasActiveSession()).toBe(true);
        await localData.addProduct({ name: 'Secure product', price: 250 });
        expect(await localData.getProducts()).toEqual([
            expect.objectContaining({ name: 'Secure product', price: 250 }),
        ]);

        localData.clearSession();
        expect(localData.hasActiveSession()).toBe(false);
    });
});
