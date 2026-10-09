import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import WorkspaceSearch from './WorkspaceSearch';

jest.mock('react-redux', () => ({ useSelector: jest.fn() }));
function Route() { const location = useLocation(); return <output data-testid='route'>{location.pathname}{location.search}</output>; }
test('keyboard search finds an invoice and navigates without changing records', async () => {
    useSelector.mockImplementation(select => select({ customers: [{ _id: 'c', name: 'Acme' }], bills: { bills: [{ _id: 'b', customer: 'c', date: '2026-10-01', invoiceNumber: 'BF/2627/000001' }] } }));
    render(<MemoryRouter><WorkspaceSearch /><Route /></MemoryRouter>);
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    const search = await screen.findByLabelText('Search pages, customers or invoices');
    fireEvent.change(search, { target: { value: 'BF/2627' } });
    expect(screen.getByText('BF/2627/000001')).toBeInTheDocument();
    fireEvent.keyDown(search, { key: 'Enter' });
    expect(screen.getByTestId('route')).toHaveTextContent('/billdetails/b');
});
