import React, { useEffect, useState } from 'react';
import { Button, TextField, MenuItem, Switch, FormControlLabel } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { addBill } from '../../../Redux/Actions/billAction';
import { calculateInvoice, money, states, today } from '../../../utils/indiaBilling';
import localData from '../../../data/localData';
import { usePopupForm } from '../../Popup';

export default function BillingForm({ setOpenPopup }) {
    const [dirty, setDirty] = useState(false);
    const customers = useSelector(state => state.customers);
    const products = useSelector(state => state.products);
    const dispatch = useDispatch();
    const history = useHistory();
    const [values, setValues] = useState({ customer: '', date: today(), dueDate: today(), gst: false,
        supplierGSTIN: '', customerGSTIN: '', supplierState: '', placeOfSupply: '', billingAddress: '', notes: '' });
    const [items, setItems] = useState([]);
    const [productId, setProductId] = useState('');
    const [busy, setBusy] = useState(false);
    const [defaultsLoaded, setDefaultsLoaded] = useState(false);
    const [defaultsError, setDefaultsError] = useState('');
    useEffect(() => {
        let active = true;
        localData.getSettings().then(settings => {
            if (!active) return;
            const due = new Date(); due.setDate(due.getDate() + Number(settings.dueDays || 0));
            const dueDate = `${due.getFullYear()}-${String(due.getMonth() + 1).padStart(2, '0')}-${String(due.getDate()).padStart(2, '0')}`;
            setValues(current => ({ ...current, dueDate, supplierGSTIN: settings.gstin, supplierState: settings.state,
                gst: Boolean(settings.gstin), notes: settings.terms }));
            setDefaultsLoaded(true);
        }).catch(error => { if (active) setDefaultsError(error.message); });
        return () => { active = false; };
    }, []);
    const field = (name, label, props = {}) => <TextField id={'invoice-' + name} variant='outlined' size='small' fullWidth name={name} label={label}
        value={values[name]} onChange={e => setValues({ ...values, [name]: e.target.value })} {...props} />;
    const itemChange = (index, key, value) => setItems(items.map((item, i) => i === index ? { ...item, [key]: value } : item));
    let totals, error;
    try { totals = calculateInvoice(items, values); } catch (problem) { error = problem.message; }
    const addProduct = () => {
        const product = products.find(record => record._id === productId);
        if (!product) return;
        setItems([...items, { product: product._id, name: product.name, price: product.price, quantity: 1, discount: 0, gstRate: product.gstRate ?? '', hsn: product.hsn || '', unit: product.unit || 'NOS' }]);
        setProductId('');
    };
    const submit = async event => {
        event.preventDefault();
        if (busy || error) return;
        setBusy(true);
        await dispatch(addBill({ ...values, lineItems: items }, id => {
            setOpenPopup(false);
            history.push('/billdetails/' + id);
        }));
        setBusy(false);
    };
    usePopupForm(dirty, busy);
    return <form className='invoice-studio' onChange={() => setDirty(true)} onSubmit={submit}>
        <div className='eyebrow'>BILLFLOW / INVOICE STUDIO</div>
        <h2>Create an invoice</h2><p>Confirm the details, review the totals, and issue a numbered invoice.</p>
        {!defaultsLoaded && <p role='status'>{defaultsError || 'Loading business defaults…'}</p>}
        <fieldset disabled={busy || !defaultsLoaded} className='studio-fields'>
            <div className='studio-grid'>
                {field('customer', 'Customer', { select: true, required: true, onChange: e => {
                    const customer = customers.find(c => c._id === e.target.value);
                    setValues(current => ({ ...current, customer: e.target.value, billingAddress: customer?.address || '', customerGSTIN: customer?.gstin || '', placeOfSupply: customer?.state || '' }));
                }, children: customers.map(c => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>) })}
                {field('date', 'Invoice date', { type: 'date', required: true, InputLabelProps: { shrink: true } })}
                {field('dueDate', 'Due date', { type: 'date', required: true, InputLabelProps: { shrink: true }, inputProps: { min: values.date } })}
                {field('billingAddress', 'Customer billing / delivery address', { required: true, multiline: true, inputProps: { maxLength: 500 } })}
            </div>
            <FormControlLabel control={<Switch color='primary' checked={values.gst} onChange={e => setValues({ ...values, gst: e.target.checked })} />} label='GST-registered supplier — domestic taxable supply' />
            {values.gst && <><div className='studio-grid'>
                {field('supplierGSTIN', 'Supplier GSTIN', { required: true, inputProps: { maxLength: 15 } })}
                {field('customerGSTIN', 'Customer GSTIN (optional)', { inputProps: { maxLength: 15 } })}
                {['supplierState', 'placeOfSupply'].map(name => <React.Fragment key={name}>{field(name, name === 'supplierState' ? 'Supplier state' : 'Place of supply', {
                    select: true, required: true, children: Object.entries(states).sort((a, b) => a[1].localeCompare(b[1])).map(([code, label]) => <MenuItem key={code} value={code}>{code} · {label}</MenuItem>),
                })}</React.Fragment>)}
            </div><p className='studio-hint'>Prices exclude GST. Confirm each item's rate and HSN/SAC. Exports, SEZ, reverse charge, exempt supplies, composition schemes and cess are not supported in this GST workflow.</p></>}
            <h3>Line items</h3>
            <div className='studio-product-picker'><TextField id='invoice-product' select fullWidth variant='outlined' size='small' label='Product' value={productId} onChange={e => setProductId(e.target.value)}>
                {products.map(p => <MenuItem key={p._id} value={p._id}>{p.name} · {money(p.price)}</MenuItem>)}
            </TextField><Button variant='outlined' color='primary' disabled={!productId} onClick={addProduct}>Add</Button></div>
            {items.map((item, index) => <section className='studio-item' key={index}>
                <div className='studio-item-title'><strong>{item.name}</strong><span>{money(item.price)} / unit</span><Button size='small' color='secondary' onClick={() => setItems(items.filter((_, i) => i !== index))}>Remove</Button></div>
                <div className='studio-grid'>
                    {[['quantity', 'Quantity', 1, 10000], ['discount', 'Discount %', 0, 100], ...(values.gst ? [['gstRate', 'GST %', 0, 40]] : [])].map(([key, label, min, max]) =>
                        <TextField id={'item-' + index + '-' + key} key={key} label={label} type='number' size='small' variant='outlined' required value={item[key]} inputProps={{ min, max, step: key === 'quantity' ? 1 : 0.01 }} onChange={e => itemChange(index, key, e.target.value)} />)}
                    <TextField id={'item-unit-' + index} label='Unit (e.g. NOS, HRS)' size='small' variant='outlined' required value={item.unit} inputProps={{ maxLength: 12 }} onChange={e => itemChange(index, 'unit', e.target.value)} />
                    {values.gst && <TextField id={'item-hsn-' + index} label='HSN / SAC' size='small' variant='outlined' required value={item.hsn} inputProps={{ pattern: '[0-9]{4,8}', maxLength: 8 }} onChange={e => itemChange(index, 'hsn', e.target.value)} />}
                </div>
            </section>)}
            {totals ? <div className='studio-totals'>
                <div><span>Subtotal</span><strong>{money(totals.gross)}</strong></div>
                <div><span>Discount</span><strong>−{money(totals.discountAmount)}</strong></div>
                <div><span>Taxable value</span><strong>{money(totals.taxable)}</strong></div>
                {values.gst && (totals.interstate ? <div><span>IGST</span><strong>{money(totals.igst)}</strong></div> : <><div><span>CGST</span><strong>{money(totals.cgst)}</strong></div><div><span>{totals.localTax}</span><strong>{money(totals.stateTax)}</strong></div></>)}
                <div className='studio-grand-total'><span>Invoice total</span><strong>{money(totals.total)}</strong></div>
            </div> : <p role='status'>{error}</p>}
            {field('notes', 'Notes / payment terms', { multiline: true, rows: 2, inputProps: { maxLength: 1000 } })}
            <p className='studio-hint'>Issuing saves a fixed copy of customer, business and product details. Issued invoices cannot be deleted. Payments are recorded separately.</p>
            <Button variant='contained' color='primary' type='submit' disabled={busy || !totals || !values.customer}>{busy ? 'Issuing…' : 'Issue invoice'}</Button>
        </fieldset>
    </form>;
}
