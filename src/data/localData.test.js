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
