import {
  createStyles,
  Divider,
  IconButton,
  Theme,
  Typography,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import React, { PropsWithChildren } from 'react';
import MandelbrotMapsLogo from '../../img/logo-192.png';

const dialogStyles = (theme: Theme) =>
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
      height: 48,
    },
    titleText: {
      fontSize: 24,
      margin: 'auto 16px',
      display: 'flex',
      alignItems: 'center',
      // alignContent: 'center',
      justifyContent: 'center',
      flexGrow: 1,
    },
    closeButton: {
      color: theme.palette.grey[500],
    },
  });

export interface DialogTitleProps
  extends PropsWithChildren<WithStyles<typeof dialogStyles>> {
  onClose: () => void;
  id?: string;
}

// https://material-ui.com/guides/typescript/#usage-of-withstyles
export const DialogTitle = withStyles(dialogStyles)(
  ({ children, classes, onClose, ...other }: DialogTitleProps) => {
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <img
          src={MandelbrotMapsLogo}
          alt="Mandelbrot Maps logo"
          className={classes.image}
        />
        <Typography variant="h1" align="center" className={classes.titleText}>
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

export const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
}))(MuiDialogContent);

export const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export const DialogDivider = (): JSX.Element => (
  <Divider style={{ marginTop: 20, marginBottom: 20 }} />
);

export const Alert = (props: AlertProps): JSX.Element => (
  <MuiAlert elevation={6} variant="filled" {...props} />
);
