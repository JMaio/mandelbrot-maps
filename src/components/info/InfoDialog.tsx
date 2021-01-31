import {
  Box,
  Divider,
  Grid,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import GitHubIcon from '@material-ui/icons/GitHub';
import LaunchIcon from '@material-ui/icons/Launch';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
// for evaluating build time
import preval from 'preval.macro';
import React, { PropsWithChildren, useMemo, useState } from 'react';
import { InfoDialogProps } from '../../common/info';
import clientDetect from '../../dist/clientDetect';
import MandelbrotMapsLogo from '../../img/logo-192.png';
import survey from '../surveyLink.json';
import { DialogInfoMarkdown } from './MarkdownOverrides';

const dateTimeStamp = preval`module.exports = new Date();`;

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
      display: 'flex',
      flexDirection: 'row',
      // align: "middle",
    },
    image: {
      marginTop: 'auto',
      marginBottom: 'auto',
      marginRight: 8,
      height: 48,
    },
    closeButton: {
      // position: 'absolute',
      // right: theme.spacing(1),
      // top: theme.spacing(1),
      marginLeft: 'auto',
      color: theme.palette.grey[500],
    },
  });

export interface DialogTitleProps extends PropsWithChildren<WithStyles<typeof styles>> {
  onClose: () => void;
  id: string;
}

// https://material-ui.com/guides/typescript/#usage-of-withstyles
const DialogTitle = withStyles(styles)(
  ({ children, classes, onClose, ...other }: DialogTitleProps) => {
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <img
          src={MandelbrotMapsLogo}
          alt="Mandelbrot Maps logo"
          className={classes.image}
        />
        <Typography
          variant="h1"
          style={{ fontSize: 24, marginTop: 'auto', marginBottom: 'auto' }}
        >
          {children}
        </Typography>
        {onClose ? (
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  },
);

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const Alert = (props: AlertProps) => (
  <MuiAlert elevation={6} variant="filled" {...props} />
);

const DialogDivider = () => <Divider style={{ marginTop: 20, marginBottom: 20 }} />;

export default function InfoDialog({
  ctrl: [open, setOpen],
  ...props
}: InfoDialogProps): JSX.Element {
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const handleClose = () => setOpen(false);

  // guard against null / undefined window
  const clientData = useMemo(() => clientDetect(window), []);

  const writeClientDataToClipboard = () => {
    const data = JSON.stringify(clientData);
    console.log(snackBarOpen);
    try {
      navigator.clipboard.writeText(data);
      setSnackBarOpen(true);
    } catch (e) {
      window.prompt('Auto copy to clipboard failed, please copy manually:', data);
    }
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      maxWidth="md"
      PaperProps={{
        style: {
          // fill more of the screen with this dialog
          margin: 16,
          maxHeight: 'calc(100% - 32px)',
        },
      }}
    >
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        Mandelbrot Maps
      </DialogTitle>
      <DialogContent dividers style={{ maxWidth: 700 }}>
        <Grid
          container
          justify="center"
          style={{
            marginBottom: 16,
          }}
        >
          <Grid item>
            <Button
              endIcon={<GitHubIcon />}
              startIcon={<LaunchIcon />}
              href="https://github.com/JMaio/mandelbrot-maps"
              target="_blank"
              rel="noopener"
            >
              View on GitHub
            </Button>
          </Grid>
        </Grid>

        <DialogInfoMarkdown />

        <DialogDivider />

        <Box style={{ display: 'flex' }}>
          <TableContainer
            component={Paper}
            style={{ width: 'auto', margin: 'auto', maxWidth: 460 }}
            // attempt to stop manual copying of the table
            onClick={writeClientDataToClipboard}
            // https://stackoverflow.com/a/46337736/9184658
            onContextMenu={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
              e.preventDefault();
              writeClientDataToClipboard();
            }}
          >
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={2} variant="head">
                    Device properties
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(clientData).map(([k, v]) => (
                  <TableRow key={k}>
                    <TableCell style={{ userSelect: 'none' }}>{k}</TableCell>
                    <TableCell align="right" style={{ fontFamily: 'monospace' }}>
                      {String(v)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <DialogDivider />

        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography align="center" style={{ margin: 'auto' }}>
            Build
          </Typography>
          <Typography style={{ fontFamily: 'monospace' }}>{dateTimeStamp}</Typography>
          <Typography style={{ fontFamily: 'monospace' }}>
            {process.env.REACT_APP_GIT_SHA}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => {
            writeClientDataToClipboard();
          }}
          color="primary"
          variant="outlined"
          startIcon={<FileCopyIcon />}
        >
          Copy info
        </Button>
        <Snackbar
          open={snackBarOpen}
          autoHideDuration={5000}
          // clicking outside the snackbar would trigger close
          onClose={(e, reason) => {
            switch (reason) {
              case 'clickaway':
                // don't close the snackbar on clicking outside
                break;
              default:
                setSnackBarOpen(false);
            }
          }}
        >
          <Alert onClose={() => setSnackBarOpen(false)} severity="info">
            Device properties copied!
          </Alert>
        </Snackbar>
        <Button
          color="primary"
          variant="outlined"
          startIcon={<LaunchIcon />}
          href={survey.link}
          target="_blank"
          rel="noopener"
        >
          Feedback
        </Button>
      </DialogActions>
    </Dialog>
  );
}
