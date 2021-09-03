import React from 'react';
import {
   Dialog,
   DialogTitle,
   DialogContent,
   makeStyles,
   Typography,
} from '@material-ui/core';
import ActionButton from '../../controls/ActionButton';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
   dialogWrapper: {
      padding: theme.spacing(2),
      position: 'absolute',
   },
   dialogTitle: {
      paddingRight: '0px',
   },
}));

export default function Popup(props) {
   const { children, openPopup, setOpenPopup } = props;
   const classes = useStyles();

   return (
      <Dialog
         open={openPopup}
         maxWidth="md"
         classes={{ paper: classes.dialogWrapper }}
      >
         <DialogTitle className={classes.dialogTitle}>
            <div style={{ display: 'flex' }}>
               <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
                  {}
               </Typography>
               <ActionButton
                  color="secondary"
                  onClick={() => {
                     setOpenPopup(false);
                  }}
               >
                  <CloseIcon />
               </ActionButton>
            </div>
         </DialogTitle>
         <DialogContent>{children}</DialogContent>
      </Dialog>
   );
}
