import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useDispatch } from 'react-redux';
import CustomerForm from './Dashboard/customers/CustomerForm';
import Popup from './Popup';

jest.mock('react-redux', () => ({ useDispatch: jest.fn() }));
jest.mock('../Redux/Actions/customersAction', () => ({ addCustomer: values => ({ type: 'ADD', values }), editCustomer: values => ({ type: 'EDIT', values }) }));
test('retains form entries on failed save and closes only after confirmed success', async () => {
    const dispatch = jest.fn().mockResolvedValueOnce({ ok: false, error: 'Storage is full' }).mockResolvedValueOnce({ ok: true });
    useDispatch.mockReturnValue(dispatch);
    const close = jest.fn();
    render(<CustomerForm setOpenPopup={close} />);
    fireEvent.change(screen.getByLabelText(/Customer \/ display name/), { target: { value: 'Acme' } });
    fireEvent.change(screen.getByLabelText(/Billing email/), { target: { value: 'buyer@example.test' } });
    fireEvent.change(screen.getByLabelText(/Phone number/), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByLabelText('Internal notes'), { target: { value: 'Contact before delivery' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create customer' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Storage is full');
    expect(close).not.toHaveBeenCalled();
    expect(screen.getByLabelText(/Customer \/ display name/)).toHaveValue('Acme');
    fireEvent.click(screen.getByRole('button', { name: 'Create customer' }));
    await waitFor(() => expect(close).toHaveBeenCalledWith(false));
    expect(dispatch.mock.calls[1][0].values.notes).toBe('Contact before delivery');
});

test('unsaved edits require confirmation when closing the studio', async () => {
    useDispatch.mockReturnValue(jest.fn());
    function Harness() { const [open, setOpen] = useState(true); return <Popup title='Customer studio' openPopup={open} setOpenPopup={setOpen}><CustomerForm setOpenPopup={setOpen} /></Popup>; }
    render(<Harness />);
    fireEvent.change(screen.getByLabelText(/Customer \/ display name/), { target: { value: 'Keep this' } });
    fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(await screen.findByText('Discard unsaved changes?')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Keep editing' }));
    expect(screen.getByLabelText(/Customer \/ display name/)).toHaveValue('Keep this');
});
