import React from 'react';
import { Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
   root: {
      minWidth: 0,
      margin: theme.spacing(0.5),
      width: 36,
      height: 36,
      padding: 0,
      borderRadius: 10,
      transition: 'transform .2s ease, box-shadow .2s ease',
      '&:hover': { transform: 'translateY(-2px)' },
   },
   secondary: {
      backgroundColor: '#fff0f2',
      '& .MuiButton-label': {
         color: '#c2414c',
      },
   },
   primary: {
      backgroundColor: '#eef0ff',
      '& .MuiButton-label': {
         color: theme.palette.primary.main,
      },
   },
}));

export default function ActionButton(props) {
   const { color, children, ...other } = props;
   const classes = useStyles();

   return (
      <Button className={`${classes.root} ${classes[color]}`} {...other}>
         {children}
      </Button>
   );
}
