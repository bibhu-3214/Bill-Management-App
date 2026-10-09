import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import localData from '../../data/localData';
import { today } from '../../utils/indiaBilling';

export default function BackupExport() {
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState('');
    const download = async () => {
        setBusy(true); setMessage('');
        try {
            const data = await localData.exportBackup();
            const url = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
            const link = document.createElement('a');
            link.href = url; link.download = 'BillFlow-backup-' + today() + '.json';
            document.body.appendChild(link); link.click(); link.remove();
            setTimeout(() => URL.revokeObjectURL(url), 60000);
            setMessage('Download requested. Confirm the file was saved, then test recovery in a separate browser profile.');
        } catch (error) { setMessage(error.message); }
        finally { setBusy(false); }
    };
    return <section className='surface-card settings-card backup-panel'><h2>Encrypted workspace backup</h2>
        <p>Download your customers, catalog, manual stock balances and movement history, customer follow-ups and outcomes, invoice drafts, quotations, item templates, issued invoices, payments, corrections, numbering and business settings. Only this account is included; session credentials are not exported.</p>
        <p>Keep the file somewhere safe outside this browser. You must retain your current account password: there is no password recovery. Anyone with both the file and password can read it.</p>
        <Button variant='outlined' color='primary' disabled={busy} onClick={download}>{busy ? 'Preparing…' : 'Download encrypted backup'}</Button>
        <p role='status'>{message}</p><p>To recover, open Sign in → Recover from an encrypted backup. Backups are manual snapshots, not automatic cloud sync.</p>
    </section>;
}
