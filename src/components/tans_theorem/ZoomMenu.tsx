import { Button, Typography, Card, Grid } from '@material-ui/core';
import React from 'react';
import { ZoomCardProps } from '../../common/tans';
import { AnimationStatus } from './AnimationFinalCard';
import { warpToPoint } from '../../common/utils';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import { ThetaType, ZoomType } from '../../common/types';
import { formatAngle, formatComplexNumber } from './tansTheoremUtils';
import Dialog from '@material-ui/core/Dialog';
import { DialogContent, DialogDivider, DialogTitle } from '../custom/DialogComponents';

const INITIAL_ZOOM = 1;

export interface SimpleDialogProps {
  animationState: AnimationStatus;
  open: boolean;
  onClose: (value: string) => void;
}

const ZoomMenu = (props: ZoomCardProps): JSX.Element => {
  const zoomMandelbrot = () => {
    props.setAnimationState(AnimationStatus.ZOOM_J);
    const zoomM: ZoomType = props.focusedPointMandelbrot.factorMagnitude * INITIAL_ZOOM;

    warpToPoint(props.mandelbrot, {
      xy: props.focusedPointMandelbrot.point,
      z: zoomM,
      theta: 0,
    });
  };

  const icons = {
    '-1': 'null',
    0: 'null',
    1: 'null',
    2: <ZoomInIcon />,
    3: <ZoomInIcon />,
    4: <RotateRightIcon />,
    5: <RotateRightIcon />,
    6: 'null',
  };

  const titleStrings = {
    '-1': 'null',
    0: 'null',
    1: 'null',
    2: 'Magnify M by',
    3: 'Magnify J by',
    4: 'Rotate M by',
    5: 'Rotate J by',
    6: 'null',
  };

  const factorText = {
    '-1': 'null',
    0: 'null',
    1: 'null',
    2: `|${formatComplexNumber(props.focusedPointMandelbrot.factor, 1)}| = ${Math.round(
      props.focusedPointMandelbrot.factorMagnitude,
    )}x`,
    3: `|${formatComplexNumber(props.focusedPointJulia.factor, 1)}| = ${Math.round(
      props.focusedPointJulia.factorMagnitude,
    )}x`,
    4: `arg(${formatComplexNumber(
      props.focusedPointMandelbrot.factor,
      1,
    )}) = ${formatAngle(props.focusedPointMandelbrot.factorAngle)}`,
    5: `arg(${formatComplexNumber(props.focusedPointJulia.factor, 1)}) = ${formatAngle(
      props.focusedPointJulia.factorAngle,
    )}`,
    6: 'null',
  };

  const factorTextExpanded = {
    '-1': 'null',
    0: 'null',
    1: 'null',
    2: `|u'(c)| = |${formatComplexNumber(props.focusedPointMandelbrot.factor, 2)}| = ${
      Math.round(props.focusedPointMandelbrot.factorMagnitude * 100) / 100
    }`,
    3: `|a| = |${formatComplexNumber(props.focusedPointJulia.factor, 2)}| = ${
      Math.round(props.focusedPointJulia.factorMagnitude * 100) / 100
    }`,
    4: `arg(u'(c)) = arg(${formatComplexNumber(
      props.focusedPointMandelbrot.factor,
      2,
    )}) = ${formatAngle(props.focusedPointMandelbrot.factorAngle)}`,
    5: `arg(a) = arg(${formatComplexNumber(
      props.focusedPointJulia.factor,
      2,
    )}) = ${formatAngle(props.focusedPointJulia.factorAngle)}`,
    6: 'null',
  };

  const paragraph1 = {
    '-1': 'null',
    0: 'null',
    1: 'null',
    2: `The complex number, u'(c), used to "align" the Mandelbrot set is the following:`,
    3: `The complex number, a, used to "align" the Julia set is the following:`,
    4: `The complex number, u'(c), used to "align" the Mandelbrot set is the following:`,
    5: `The complex number, a, used to "align" the Julia set is the following:`,
    6: 'null',
  };

  const paragraph2 = {
    '-1': 'null',
    0: 'null',
    1: 'null',
    2: `To magnify, we take the magnitude of u'(c), so the magnification factor is:`,
    3: `To magnify, we take the magnitude of a, so the magnification factor is:`,
    4: `To rotate, we take the argument of u'(c), so the rotation factor is:`,
    5: `To rotate, we take the argument of a, so the rotation factor is:`,
    6: 'null',
  };

  const numberText = {
    '-1': 'null',
    0: 'null',
    1: 'null',
    2: `u'(c) = ${formatComplexNumber(props.focusedPointMandelbrot.factor, 2)}`,
    3: `a = ${formatComplexNumber(props.focusedPointJulia.factor, 2)}`,
    4: `u'(c) = ${formatComplexNumber(props.focusedPointMandelbrot.factor, 2)}`,
    5: `a = ${formatComplexNumber(props.focusedPointJulia.factor, 2)}`,
    6: 'null',
  };

  const dialogText = {
    '-1': 'null',
    0: 'null',
    1: 'null',
    2: `The Mandelbrot set magnification factor`,
    3: `The Julia set magnification factor`,
    4: `The Mandelbrot set rotation factor`,
    5: `The Julia set rotation factor`,
    6: 'null',
  };

  function SimpleDialog(props: SimpleDialogProps) {
    const { onClose, open } = props;

    const handleClose = () => {
      onClose('null');
    };

    return (
      <Dialog
        style={{ zIndex: 1500 }}
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        <DialogTitle onClose={handleClose}>
          {icons[props.animationState]}
          {dialogText[props.animationState]}
        </DialogTitle>
        <DialogContent dividers>
          <div style={{ margin: 16 }}>
            <Typography>
              To show the similarity between the Mandelbrot and Julia set, we multiply
              every point in each set by a particular complex number. Geometrically,
              multiplying two complex numbers is equivalent to multiplying their
              magnitudes and adding their angles. That&apos;s why we magnify and rotate in
              this animation!
            </Typography>
            <DialogDivider />
            <Typography>{paragraph1[props.animationState]}</Typography>
            <Typography>{numberText[props.animationState]}</Typography>
            <Typography>{paragraph2[props.animationState]}</Typography>
            <Typography>{factorTextExpanded[props.animationState]}</Typography>
            <DialogDivider />
            <Typography
              style={{
                fontSize: '0.8rem',
              }}
            >
              For the full details on calculating the magnification and rotation factors
              for each set, read &quot; Lei Tan, Similarity Between the Mandelbrot Set and
              Julia Sets&quot;, 1990, page 609.
            </Typography>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  const zoomJulia = () => {
    props.setAnimationState(AnimationStatus.ROTATE_M);

    const zoomJ: ZoomType = props.focusedPointJulia.factorMagnitude * INITIAL_ZOOM;

    warpToPoint(props.julia, { xy: props.focusedPointJulia.point, z: zoomJ, theta: 0 });
  };

  const rotateMandelbrot = () => {
    props.setAnimationState(AnimationStatus.ROTATE_J);

    const zoomM: ZoomType = props.focusedPointMandelbrot.factorMagnitude * INITIAL_ZOOM;
    const thetaM: ThetaType = -props.focusedPointMandelbrot.factorAngle;

    warpToPoint(props.mandelbrot, {
      xy: props.focusedPointMandelbrot.point,
      z: zoomM,
      theta: thetaM,
    });
  };

  const rotateJulia = () => {
    props.setAnimationState(AnimationStatus.PLAY);

    const zoomJ: ZoomType = props.focusedPointJulia.factorMagnitude * INITIAL_ZOOM;
    const thetaJ: ThetaType = -props.focusedPointJulia.factorAngle;

    warpToPoint(props.julia, {
      xy: props.focusedPointJulia.point,
      z: zoomJ,
      theta: thetaJ,
    });
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card
      style={{
        padding: 12,
        zIndex: 1400,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 1,
        marginBottom: 8,
      }}
    >
      <Grid container>
        <Grid item>{props.backButton()}</Grid>
        <Grid item>
          <Typography
            style={{
              marginBottom: 8,
            }}
            variant="h6"
            gutterBottom
          >
            {titleStrings[props.animationState]}
          </Typography>
        </Grid>
      </Grid>
      <Grid container direction="row" spacing={1}>
        <Grid item>
          <Typography
            gutterBottom
            style={{
              fontSize: '1.2rem',
            }}
          >
            {factorText[props.animationState]}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            style={{
              fontSize: '0.5rem',
            }}
            color="primary"
            onClick={handleClickOpen}
          >
            How is this <br /> calculated?
          </Button>
        </Grid>
      </Grid>
      <Button
        fullWidth
        variant="contained"
        style={{ marginTop: 8 }}
        onClick={() => {
          switch (props.animationState) {
            case AnimationStatus.ZOOM_M:
              zoomMandelbrot();
              break;
            case AnimationStatus.ZOOM_J:
              zoomJulia();
              break;
            case AnimationStatus.ROTATE_M:
              rotateMandelbrot();
              break;
            case AnimationStatus.ROTATE_J:
              rotateJulia();
              break;
            default:
              break;
          }
        }}
        startIcon={icons[props.animationState]}
      ></Button>{' '}
      <SimpleDialog
        animationState={props.animationState}
        open={open}
        onClose={handleClose}
      />
    </Card>
  );
};

export default ZoomMenu;
