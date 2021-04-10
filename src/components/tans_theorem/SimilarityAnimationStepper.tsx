import {
  Button,
  Stepper,
  StepLabel,
  Step,
  IconButton,
  Dialog,
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';
import {
  formatAngle,
  formatComplexNumber,
  PreperiodicPoint,
  round,
} from './tansTheoremUtils';
import { SimilarityAnimationProps } from '../../common/tans';
import { AnimationStatus } from './AnimationFinalCard';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { DialogContent, DialogDivider, DialogTitle } from '../custom/DialogComponents';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import PointsList from './PointsList';

interface SimpleDialogProps {
  animationState: AnimationStatus;
  open: boolean;
  onClose: (value: string) => void;
}

const SimilarityAnimationStepper = (props: SimilarityAnimationProps): JSX.Element => {
  function getSteps(
    c: PreperiodicPoint,
    cj: PreperiodicPoint,
    animationState: AnimationStatus,
  ): [string, JSX.Element | string][] {
    if (
      animationState === AnimationStatus.SELECT_MANDELBROT_POINT ||
      animationState === AnimationStatus.INTRO
    ) {
      return [
        [
          'Select point in Mandelbrot set',
          // eslint-disable-next-line react/jsx-key
          <PointsList
            focusedPoint={c}
            points={props.pointsMandelbrot}
            displayText={(c) => formatComplexNumber(c.point)}
            handleSelection={props.handlePointSelectionMandelbrot}
          />,
        ],
        ['Select point in Julia set', `?`],
        ['Magnify Mandelbrot', `${round(c.factorMagnitude, 1)}x`],
        ['Magnify Julia', `?x`],
        ['Rotate Mandelbrot', `${formatAngle(c.factorAngle)}`],
        ['Rotate Julia', `?°`],
      ];
    } else if (animationState === AnimationStatus.SELECT_JULIA_POINT) {
      return [
        ['Select point in Mandelbrot set', `${formatComplexNumber(c.point)}`],
        [
          'Select point in Julia set',
          // eslint-disable-next-line react/jsx-key
          <PointsList
            focusedPoint={cj}
            points={props.pointsJulia}
            displayText={(c) => `${formatComplexNumber(c.point)} `}
            handleSelection={props.handlePointSelectionJulia}
          />,
        ],
        ['Magnify Mandelbrot', `${round(c.factorMagnitude, 1)}x`],
        ['Magnify Julia', `${round(cj.factorMagnitude, 1)}x`],
        ['Rotate Mandelbrot', `${formatAngle(c.factorAngle)}`],
        ['Rotate Julia', `${formatAngle(cj.factorAngle)}`],
      ];
    } else {
      return [
        ['Select point in Mandelbrot set', `${formatComplexNumber(c.point)}`],
        ['Select point in Julia set', `${formatComplexNumber(cj.point)}`],
        ['Magnify Mandelbrot', `${round(c.factorMagnitude, 1)}x`],
        ['Magnify Julia', `${round(cj.factorMagnitude, 1)}x`],
        ['Rotate Mandelbrot', `${formatAngle(c.factorAngle)}`],
        ['Rotate Julia', `${formatAngle(cj.factorAngle)}`],
      ];
    }
  }
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

  const steps = getSteps(
    props.focusedPointMandelbrot,
    props.focusedPointJulia,
    props.animationState,
  );

  const [expanded, setExpanded] = useState(false);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div
      style={{
        fontSize: '0.8rem',
      }}
    >
      <IconButton
        style={{ position: 'absolute', right: 0 }}
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? <KeyboardArrowLeftIcon /> : <KeyboardArrowRightIcon />}
      </IconButton>
      {expanded ? (
        <Stepper activeStep={props.animationState.valueOf()} orientation="horizontal">
          {steps.map((label) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: { optional?: React.ReactNode } = {};
            labelProps.optional = (
              <div>
                {label[1]}
                {label[0][0] !== 'S' ? (
                  <Button
                    style={{
                      fontSize: '0.5rem',
                      marginLeft: 8,
                    }}
                    onClick={handleClickOpen}
                    color="primary"
                  >
                    How is this calculated?
                  </Button>
                ) : null}
              </div>
            );
            return (
              <Step key={label[0]} {...stepProps}>
                <StepLabel {...labelProps}>{label[0]}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      ) : (
        <Stepper activeStep={props.animationState.valueOf()} orientation="horizontal">
          {steps.map((label) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: { optional?: React.ReactNode } = {};
            labelProps.optional = (
              <div>
                {label[1]}
                {label[0][0] !== 'S' ? (
                  <Button
                    style={{
                      fontSize: '0.5rem',
                      marginLeft: 8,
                    }}
                    onClick={handleClickOpen}
                    color="primary"
                  >
                    How is this calculated?
                  </Button>
                ) : null}
              </div>
            );
            return steps[props.animationState] === label ? (
              <Step key={label[0]} {...stepProps}>
                <StepLabel {...labelProps}>{label[0]}</StepLabel>
              </Step>
            ) : (
              <Step key={label[0]} {...stepProps}>
                <StepLabel></StepLabel>
              </Step>
            );
          })}
        </Stepper>
      )}
      <SimpleDialog
        animationState={props.animationState}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
};

export default SimilarityAnimationStepper;
