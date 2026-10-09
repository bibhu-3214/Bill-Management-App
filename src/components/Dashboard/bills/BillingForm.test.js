import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addBill } from '../../../Redux/Actions/billAction';
import BillingForm from './BillingForm';

jest.mock('react-redux', () => ({ useDispatch: jest.fn(), useSelector: jest.fn() }));
jest.mock('react-router', () => ({ useHistory: () => ({ push: jest.fn() }) }));
jest.mock('../../../Redux/Actions/billAction', () => ({ addBill: jest.fn(() => ({ type: 'TEST' })) }));
jest.mock('../../../data/localData', () => ({ __esModule: true, default: { getSettings: () => Promise.resolve({ dueDays: 0, gstin: '', state: '', terms: '' }) } }));

test('editor calculates a discounted preview and retains input when issuing does not succeed', async () => {
    useSelector.mockImplementation(selector => selector({ customers: [{ _id: 'c', name: 'Buyer', address: 'Saved billing address', state: '27' }], products: [{ _id: 'p', name: 'Consulting', price: 100 }] }));
    useDispatch.mockReturnValue(jest.fn().mockResolvedValue(undefined));
    const close = jest.fn();
    render(<BillingForm setOpenPopup={close} />);
    await waitFor(() => expect(screen.queryByText('Loading business defaults…')).not.toBeInTheDocument());
    fireEvent.mouseDown(screen.getByRole('button', { name: /Customer/ }));
    fireEvent.click(screen.getByRole('option', { name: 'Buyer' }));
    expect(screen.getByLabelText(/Customer billing/)).toHaveValue('Saved billing address');
    fireEvent.change(screen.getByLabelText(/Customer billing/), { target: { value: 'Mumbai' } });
    fireEvent.mouseDown(screen.getByLabelText('Product'));
    fireEvent.click(screen.getByRole('option', { name: /Consulting/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));
    fireEvent.change(screen.getByLabelText(/Quantity/), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText(/Discount %/), { target: { value: '10' } });
    expect(screen.getAllByText('₹180.00')).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', { name: 'Issue invoice' }));
    await waitFor(() => expect(addBill).toHaveBeenCalled());
    expect(addBill.mock.calls[0][0]).toMatchObject({ customer: 'c', billingAddress: 'Mumbai', lineItems: [expect.objectContaining({ quantity: '2', discount: '10' })] });
    expect(close).not.toHaveBeenCalled();
    expect(screen.getByLabelText(/Customer billing/)).toHaveValue('Mumbai');
});
