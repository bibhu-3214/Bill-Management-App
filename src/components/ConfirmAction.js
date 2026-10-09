import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';

export default function ConfirmAction({ confirmDialog, setConfirmDialog }) {
    const close = () => setConfirmDialog({ ...confirmDialog, isOpen: false });
    return <Dialog open={confirmDialog.isOpen} onClose={close} maxWidth='xs' fullWidth aria-labelledby='confirm-action-title' className='confirmation-dialog'>
        <DialogTitle id='confirm-action-title'><span className='confirm-symbol'><DeleteOutlineRoundedIcon /></span>{confirmDialog.title || 'Delete this record?'}</DialogTitle>
        <DialogContent><p>{confirmDialog.subTitle || 'This permanently removes the record from this workspace. Records referenced by invoices cannot be deleted.'}</p></DialogContent>
        <DialogActions><Button onClick={close}>Keep record</Button><Button variant='contained' color='secondary' onClick={confirmDialog.onConfirm}>Delete record</Button></DialogActions>
    </Dialog>;
}
