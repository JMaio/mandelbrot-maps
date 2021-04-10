import { Typography, Box, Dialog } from '@material-ui/core';
import React from 'react';
import { SelectMenuProps } from '../../common/tans';
import { DialogContent, DialogTitle } from '../custom/DialogComponents';

const IntroDialog = (props: SelectMenuProps): JSX.Element => {
  const [open, setOpen] = React.useState(true);

  if (props.show) {
    props.handleGo();
  }

  const onClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      style={{ zIndex: 1500 }}
      onClose={onClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle onClose={onClose}>Welcome to the Tans theorem explorer!</DialogTitle>
      <DialogContent dividers>
        <div style={{ margin: 16 }}>
          <Typography
            style={{
              marginBottom: 8,
            }}
            gutterBottom
          >
            Tan&apos;s theorem states that, at particular points, the Mandelbrot set and
            the corresponding Julia set are almost{' '}
            <Box fontWeight="fontWeightBold" m={0} display="inline">
              indistinguishable
            </Box>
            .
          </Typography>
          <Typography
            style={{
              marginBottom: 8,
            }}
            gutterBottom
          >
            This feature will take you through the process of selecting a point on each
            set, then magnifying and rotating them to best show the similarity.
          </Typography>
          <Typography
            style={{
              marginBottom: 8,
            }}
            gutterBottom
          >
            To start, simply exit this popup then follow the steps provided.
          </Typography>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IntroDialog;
