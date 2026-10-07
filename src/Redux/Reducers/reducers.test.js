import billReducer from './billReducer';
import customersReducer from './customersReducer';
import productReducer from './productReducer';
import { GET_BILL_BY_ID, REMOVE_CUSTOMER, REMOVE_PRODUCT } from '../actionTypes';

describe('reducers', () => {
    test('unknown actions preserve state references', () => {
        const products = [{ _id: 'p1' }];
        const customers = [{ _id: 'c1' }];
        const bills = { bills: [], billDetails: {} };

        expect(productReducer(products, { type: 'UNKNOWN' })).toBe(products);
        expect(customersReducer(customers, { type: 'UNKNOWN' })).toBe(customers);
        expect(billReducer(bills, { type: 'UNKNOWN' })).toBe(bills);
    });

    test('removes products and customers by id', () => {
        const records = [{ _id: '1' }, { _id: '2' }];

        expect(productReducer(records, { type: REMOVE_PRODUCT, payload: records[0] })).toEqual([
            records[1],
        ]);
        expect(customersReducer(records, { type: REMOVE_CUSTOMER, payload: records[1] })).toEqual([
            records[0],
        ]);
    });

    test('bill details use a bill-specific action', () => {
        const state = { bills: [], billDetails: {} };
        const bill = { _id: 'b1' };

        expect(billReducer(state, { type: GET_BILL_BY_ID, payload: bill }).billDetails).toBe(bill);
        expect(billReducer(state, { type: 'GET_PRODUCT_BY_ID', payload: bill })).toBe(state);
    });
});
