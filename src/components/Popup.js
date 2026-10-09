import React, { createContext, useContext, useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const PopupContext = createContext(null);
export function usePopupForm(dirty, busy) {
    const context = useContext(PopupContext);
    const setDirty = context?.setDirty;
    const setBusy = context?.setBusy;
    useEffect(() => { setDirty?.(dirty); return () => setDirty?.(false); }, [dirty, setDirty]);
    useEffect(() => { setBusy?.(busy); return () => setBusy?.(false); }, [busy, setBusy]);
    return context?.close;
}

export default function Popup({ children, openPopup, setOpenPopup, title = 'Workspace details' }) {
    const [dirty, setDirty] = useState(false);
    const [busy, setBusy] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const close = () => { if (!busy) { if (dirty) setConfirm(true); else setOpenPopup(false); } };
    useEffect(() => { if (!openPopup) { setConfirm(false); setDirty(false); setBusy(false); } }, [openPopup]);
    return <PopupContext.Provider value={{ setDirty, setBusy, close }}>
        <Dialog open={openPopup} maxWidth='md' fullWidth className='studio-dialog' aria-label={title || 'Workspace details'} onClose={close}>
            <DialogTitle disableTypography className='studio-dialog-title'><div><span className='dialog-eyebrow'>BILLFLOW WORKSPACE</span><h2>{title || 'Workspace details'}</h2></div><IconButton aria-label='Close dialog' disabled={busy} onClick={close}><CloseIcon /></IconButton></DialogTitle>
            <DialogContent className='studio-dialog-content'>{children}</DialogContent>
        </Dialog>
        <Dialog open={confirm && openPopup} onClose={() => setConfirm(false)} aria-labelledby='discard-title' maxWidth='xs' fullWidth><DialogTitle id='discard-title'>Discard unsaved changes?</DialogTitle><DialogContent>Your changes have not been saved. Keep editing to finish this record.</DialogContent><DialogActions><Button onClick={() => setConfirm(false)} color='primary'>Keep editing</Button><Button onClick={() => { setConfirm(false); setOpenPopup(false); }} color='secondary'>Discard changes</Button></DialogActions></Dialog>
    </PopupContext.Provider>;
}
