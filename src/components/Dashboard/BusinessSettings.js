import React, { useEffect, useState } from 'react';
import { Button, TextField, MenuItem } from '@material-ui/core';
import localData from '../../data/localData';
import { states } from '../../utils/indiaBilling';
import BackupExport from './BackupExport';

export default function BusinessSettings() {
    const [values, setValues] = useState(null);
    const [message, setMessage] = useState('');
    const [busy, setBusy] = useState(false);
    useEffect(() => { localData.getSettings().then(setValues).catch(e => setMessage(e.message)); }, []);
    const upload = async event => {
        const file = event.target.files[0];
        if (!file) return;
        if (!['image/png', 'image/jpeg'].includes(file.type) || file.size > 130000) { setMessage('Choose a PNG or JPEG under 130 KB.'); return; }
        const reader = new FileReader();
        reader.onload = () => setValues(current => ({ ...current, logo: reader.result }));
        reader.onerror = () => setMessage('The image could not be read.');
        reader.readAsDataURL(file);
    };
    const save = async event => {
        event.preventDefault(); setBusy(true); setMessage('');
        try { await localData.saveSettings(values); setMessage('Business defaults saved. Existing invoices are unchanged.'); }
        catch (error) { setMessage(error.message); }
        finally { setBusy(false); }
    };
    return <section className='workspace-page page-enter'><div className='workspace-heading'><div><h1>Business settings</h1><p>Set up your identity, branding and payment instructions once.</p></div></div>
        <p role='status'>{message}</p>
        {values && <form className='surface-card settings-card' onSubmit={save}><fieldset disabled={busy} className='studio-fields'>
            <h2>Business identity</h2><div className='studio-grid'>
                {[['name', 'Business / legal name'], ['address', 'Business address'], ['gstin', 'GSTIN (optional)'], ['dueDays', 'Payment due in days']].map(([key, label]) =>
                    <TextField id={'settings-' + key} key={key} variant='outlined' label={label} value={values[key]} required={['name', 'address', 'dueDays'].includes(key)} type={key === 'dueDays' ? 'number' : 'text'} inputProps={key === 'dueDays' ? { min: 0, max: 365, step: 1 } : { maxLength: key === 'gstin' ? 15 : 500 }} onChange={e => setValues({ ...values, [key]: e.target.value })} />)}
                <TextField id='settings-state' select variant='outlined' label='State / union territory' value={values.state} onChange={e => setValues({ ...values, state: e.target.value })}><MenuItem value=''>Not set</MenuItem>{Object.entries(states).map(([code, name]) => <MenuItem key={code} value={code}>{code} · {name}</MenuItem>)}</TextField>
            </div>
            <h2>Invoice branding</h2>{values.logo && <img className='business-logo' src={values.logo} alt='Business logo preview' />}
            <p><label htmlFor='business-logo'>Logo · PNG/JPEG, up to 130 KB</label><br /><input id='business-logo' type='file' accept='image/png,image/jpeg' onChange={upload} /></p>
            {values.logo && <Button onClick={() => setValues({ ...values, logo: '' })}>Remove logo</Button>}
            <div className='studio-grid'>{[['terms', 'Default payment terms'], ['bankDetails', 'Bank / UPI payment instructions']].map(([key, label]) => <TextField id={'settings-' + key} key={key} variant='outlined' label={label} multiline rows={3} inputProps={{ maxLength: key === 'terms' ? 1000 : 500 }} value={values[key]} onChange={e => setValues({ ...values, [key]: e.target.value })} />)}</div>
            <p className='studio-hint'>New invoices retain a copy of these details. Bank and UPI instructions are text only; BillFlow does not collect payments.</p>
            <Button type='submit' color='primary' variant='contained' disabled={busy}>{busy ? 'Saving…' : 'Save defaults'}</Button>
        </fieldset></form>}
        <BackupExport />
    </section>;
}
