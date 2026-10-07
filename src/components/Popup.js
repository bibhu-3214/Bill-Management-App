import React from 'react';
import { Dialog, DialogTitle, DialogContent, makeStyles, Typography } from '@material-ui/core';
import ActionButton from './controls/ActionButton';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
    dialogWrapper: {
        padding: theme.spacing(1.5),
        width: 'min(920px, calc(100vw - 24px))',
        maxWidth: '100%',
    },
    dialogTitle: {
        padding: theme.spacing(2, 2, 0, 3),
    },
}));

export default function Popup(props) {
    const { children, openPopup, setOpenPopup, title = '' } = props;
    const classes = useStyles();

    return (
            <Dialog open={openPopup} maxWidth='md' fullWidth classes={{ paper: classes.dialogWrapper }} onClose={() => setOpenPopup(false)}>
            <DialogTitle className={classes.dialogTitle}>
                <div style={{ display: 'flex' }}>
                    <Typography variant='h6' component='div' style={{ flexGrow: 1 }}>
                        {title}
                    </Typography>
                    <ActionButton
                        color='secondary'
                        onClick={() => {
                            setOpenPopup(false);
                        }}>
                        <CloseIcon />
                    </ActionButton>
                </div>
            </DialogTitle>
            <DialogContent>{children}</DialogContent>
        </Dialog>
    );
}
