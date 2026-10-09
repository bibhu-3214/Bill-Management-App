import { receivableRows, agingSummary, customerAccounts, reminderText } from './receivables';

const base = { _id: 'one', customer: 'c', customerSnapshot: { name: 'Original buyer' }, date: '2026-01-01', dueDate: '2026-09-08', total: 100, payments: [] };
test('ages remaining balances with explicit date boundaries, missing due dates and closed invoices', () => {
    const rows = receivableRows([base, { ...base, _id: 'two', dueDate: '2026-09-07', payments: [{ _id: 'p', amount: 40 }] },
        { ...base, _id: 'today', dueDate: '2026-10-08' }, { ...base, _id: 'none', dueDate: null },
        { ...base, _id: 'closed', creditNote: {} }], [], '2026-10-08');
    expect(rows.map(row => row.bucket)).toEqual(['1–30 days', '31–60 days', 'Not overdue', 'No due date', '1–30 days']);
    expect(rows[1].balance).toBe(60);
    expect(rows[2].daysUntilDue).toBe(0);
    expect(rows[3].daysUntilDue).toBeNull();
    expect(agingSummary(rows).map(group => group.amount)).toEqual([100, 100, 60, 0, 0, 100]);
});
test('customer balances exclude credits and cancellations, and reverse payment records correctly', () => {
    const bills = [{ ...base, payments: [{ _id: 'p', amount: 50 }], reversals: [{ paymentId: 'p', amount: 50 }] },
        { ...base, _id: 'cancel', cancellation: {} }, { ...base, _id: 'credit', creditNote: {} }, { ...base, _id: 'other', customer: 'x' }];
    expect(customerAccounts([{ _id: 'c', name: 'Updated buyer' }], bills, '2026-10-08')[0]).toMatchObject({ invoiceCount: 3, invoiced: 100, outstanding: 100, overdue: 100 });
    const row = receivableRows([base], [], '2026-10-08')[0];
    expect(reminderText(row)).toContain('Original buyer');
    expect(reminderText(row)).toContain('₹100.00');
});
