import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { Link, TableContainer, Table, Paper, TableRow, TableCell, TableHead, TableBody, Box, Divider, Snackbar } from '@material-ui/core';
import LaunchIcon from '@material-ui/icons/Launch';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import MuiAlert from '@material-ui/lab/Alert';

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

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function InfoDialog(props) {
  const [open, setOpen] = props.ctrl;
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const handleClose = () => setOpen(false);

  const clientData = window.jscd;

  let writeToClipboard = data => {
    try {
      navigator.clipboard.writeText(data);
      setSnackBarOpen(true);
    } catch (e) {
      window.prompt("Auto copy to clipboard failed, copy manually from below:", data)
    }
  }

  return (
    <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        <img
          alt="Mandelbrot Maps logo"
          width={60}
          src="https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png"></img>
        Mandelbrot Maps
        </DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          Mandelbrot Maps is an interactive fractal explorer built using React and WebGL.
            </Typography>
        <Typography gutterBottom>
          Mandelbrot set shader code adapted from <Link href="https://www.shadertoy.com/view/4df3Rn">
            Mandelbrot - smooth
                </Link> by <Link href="http://iquilezles.org/" target="_blank">
            Inigo Quilez
                </Link>.
        </Typography>
        <Divider style={{ marginTop: 8, marginBottom: 8 }} />
        <Box style={{ display: "flex"}}>
          <TableContainer component={Paper} style={{ width: "auto", margin: "auto", }}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={2} variant="head">Device properties</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(clientData).map(([k, v]) => 
                  <TableRow key={k}>
                    <TableCell>{k}</TableCell>
                    <TableCell align="right" style={{ fontFamily: "monospace"}}>{String(v)}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button autoFocus href="#" color="primary" variant="outlined" startIcon={<LaunchIcon />}>Feedback</Button>
        <Button onClick={() => {writeToClipboard(JSON.stringify(clientData))}} color="primary" variant="outlined" startIcon={<FileCopyIcon />}>Copy</Button>
        <Snackbar open={snackBarOpen} autoHideDuration={5000} onClose={() => setSnackBarOpen(false)}>
          <Alert onClose={() => setSnackBarOpen(true)} severity="info">
            Device properties copied!
          </Alert>
        </Snackbar>
      </DialogActions>
    </Dialog>
  );
}