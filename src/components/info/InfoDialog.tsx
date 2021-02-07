import {
  Box,
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
import Typography from '@material-ui/core/Typography';
import { InfoOutlined } from '@material-ui/icons';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import GitHubIcon from '@material-ui/icons/GitHub';
import LaunchIcon from '@material-ui/icons/Launch';
// for evaluating build time
import preval from 'preval.macro';
import React, { useMemo, useState } from 'react';
import { InfoDialogProps } from '../../common/info';
import clientDetect from '../../dist/clientDetect';
import {
  Alert,
  DialogActions,
  DialogContent,
  DialogDivider,
  DialogTitle,
} from '../custom/DialogComponents';
import survey from '../surveyLink.json';
import infoTextMarkdown from './info.md';
import { MarkdownFromFile } from './MarkdownOverrides';

const dateTimeStamp = preval`module.exports = new Date();`;
const GITSHA = process.env.REACT_APP_GIT_SHA;

export default function InfoDialog({
  ctrl: [open, setOpen],
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
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle onClose={handleClose}>
        <InfoOutlined style={{ marginRight: 8 }} />
        About
      </DialogTitle>
      <DialogContent dividers>
        <Grid
          container
          justify="center"
          style={{
            marginBottom: 16,
          }}
        >
          <Grid item>
            <Button
              color="primary"
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

        <MarkdownFromFile f={infoTextMarkdown} />

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
          <Button
            color="primary"
            variant="outlined"
            startIcon={<LaunchIcon />}
            href={`https://github.com/JMaio/mandelbrot-maps/tree/${GITSHA}`}
            // href={`https://${process.env.REPOSITORY}/tree/${GITSHA}`}
            target="_blank"
            rel="noopener"
            style={{ margin: '8px 0' }}
          >
            {GITSHA}
          </Button>
          <code>{dateTimeStamp}</code>
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
