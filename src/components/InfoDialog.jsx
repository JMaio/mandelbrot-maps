import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h1" style={{ fontSize: 30 }}>{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function InfoDialog(props) {
  const [open, setOpen] = props.ctrl;

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
            <img width={60}
            src="https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png"></img> 
            Mandelbrot Maps
        </DialogTitle>
        <DialogContent dividers>
            <Typography gutterBottom>
            Mandelbrot Maps is an interactive fractal explorer built using React and WebGL.
            </Typography>
            {/* <Typography gutterBottom>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
            lacus vel augue laoreet rutrum faucibus dolor auctor.
            </Typography>
            <Typography gutterBottom>
            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
            scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
            auctor fringilla.
            </Typography> */}
        </DialogContent>
        <DialogActions>
            <Button autoFocus onClick={handleClose} color="primary">Close</Button>
        </DialogActions>
    </Dialog>
  );
}