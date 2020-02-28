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
import { surveyLink } from './surveyLink.json';


const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "row",
    // align: "middle",
  },
  image: {
    marginTop: "auto",
    marginBottom: "auto",
    marginRight: 8,
    height: 50,
  },
  closeButton: {
    // position: 'absolute',
    // right: theme.spacing(1),
    // top: theme.spacing(1),
    marginLeft: "auto",
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <img src="favicon-512.png" alt="Mandelbrot Maps logo" className={classes.image} />
      <Typography variant="h1" style={{ fontSize: 24, marginTop: "auto", marginBottom: "auto" }}>{children}</Typography>
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
    padding: theme.spacing(3),
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

  // guard against null / undefined window
  const clientData = window.jscd || {};

  let writeToClipboard = data => {
    try {
      navigator.clipboard.writeText(data);
      setSnackBarOpen(true);
    } catch (e) {
      window.prompt("Auto copy to clipboard failed, copy manually from below:", data)
    }
  }

  return (
    <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} maxWidth="md">
      {/* <div style={{ maxWidth: 700 }}> */}
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
            Mandelbrot Maps
          </DialogTitle>
        <DialogContent dividers >
          <Typography gutterBottom>
            Mandelbrot Maps is an interactive fractal explorer built using React and WebGL.
          </Typography>
          <Typography gutterBottom>
            Developed by <Link href="https://jmaio.github.io/" target="_blank">Joao Maio</Link> in 2019/2020 as part of an Honours Project at The University of Edinburgh, under the supervision of Philip Wadler.
          </Typography>
          <Typography gutterBottom>
            The <Link href="https://homepages.inf.ed.ac.uk/wadler/mandelbrot-maps/index.html" target="_blank">original Mandelbrot Maps project</Link> was developed by Iain Parris in 2008 as a Java Applet. 
          </Typography>
          <Typography gutterBottom>
            The project was simultaneously undertaken by Freddie Bawden, also under the supervision of Philip Wadler. 
            Freddie's version of the project is available at: <Link href="https://mandelbrot-maps.herokuapp.com/" target="_blank">mandelbrot-maps.herokuapp.com</Link>
          </Typography>
          <Typography gutterBottom>
            Mandelbrot set shader code adapted from <Link href="https://www.shadertoy.com/view/4df3Rn">Mandelbrot - smooth</Link> by <Link href="http://iquilezles.org/" target="_blank">Inigo Quilez</Link>.
          </Typography>
          {/* <Typography>
            &copy; Joao Maio 2020
          </Typography> */}
          <Divider style={{ marginTop: 30, marginBottom: 30 }} />
          <Box style={{ display: "flex"}}>
            <TableContainer component={Paper} style={{ width: "auto", margin: "auto", maxWidth: 460,}}>
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
          <Button onClick={() => {writeToClipboard(JSON.stringify(clientData))}} color="primary" variant="outlined" startIcon={<FileCopyIcon />}>Copy</Button>
          <Snackbar open={snackBarOpen} autoHideDuration={5000} onClose={() => setSnackBarOpen(false)}>
            <Alert onClose={() => setSnackBarOpen(false)} severity="info">
              Device properties copied!
            </Alert>
          </Snackbar>
          <Button autoFocus href={surveyLink} color="primary" variant="outlined" startIcon={<LaunchIcon />}>Feedback</Button>
        </DialogActions>
      {/* </div> */}
    </Dialog>
  );
}