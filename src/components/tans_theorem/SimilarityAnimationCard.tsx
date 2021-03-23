import { Card, Stepper, StepLabel, Step, Grow } from '@material-ui/core';
import React from 'react';
import {
  formatAngle,
  formatComplexNumber,
  PreperiodicPoint,
  round,
} from './tansTheoremUtils';
import { SimilarityAnimationProps } from '../../common/tans';
import { AnimationStatus } from './AnimationFinalCard';

function getSteps(
  c: PreperiodicPoint,
  cj: PreperiodicPoint,
  animationState: AnimationStatus,
) {
  if (
    animationState === AnimationStatus.SELECT_MANDELBROT_POINT ||
    animationState === AnimationStatus.INTRO
  ) {
    return [
      ['Select point in M', `?`],
      ['Select point in J', `?`],
      ['Magnify M', `?x`],
      ['Magnify J', `?x`],
      ['Rotate M', `?°`],
      ['Rotate J', `?°`],
    ];
  } else if (animationState === AnimationStatus.SELECT_JULIA_POINT) {
    return [
      ['Select point in M', `${formatComplexNumber(c.point)}`],
      ['Select point in J', `?`],
      ['Magnify M', `${round(c.factorMagnitude, 1)}x`],
      ['Magnify J', `?x`],
      ['Rotate M', `${formatAngle(c.factorAngle)}`],
      ['Rotate J', `?°`],
    ];
  } else {
    return [
      ['Select point in M', `${formatComplexNumber(c.point)}`],
      ['Select point in J', `${formatComplexNumber(cj.point)}`],
      ['Magnify M', `${round(c.factorMagnitude, 1)}x`],
      ['Magnify J', `${round(cj.factorMagnitude, 1)}x`],
      ['Rotate M', `${formatAngle(c.factorAngle)}`],
      ['Rotate J', `${formatAngle(cj.factorAngle)}`],
    ];
  }
}

const SimilarityAnimationCard = (props: SimilarityAnimationProps): JSX.Element => {
  const steps = getSteps(
    props.focusedPoint,
    props.focusedPointJulia,
    props.animationState,
  );

  return (
    <Grow in={props.show}>
      <Card
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          zIndex: 1000,
          fontSize: '0.8rem',
        }}
      >
        <Stepper activeStep={props.animationState.valueOf()} orientation="horizontal">
          {steps.map((label) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: { optional?: React.ReactNode } = {};
            labelProps.optional = label[1];
            return (
              <Step key={label[0]} {...stepProps}>
                <StepLabel {...labelProps}>{label[0]}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Card>
    </Grow>
  );
};

export default SimilarityAnimationCard;
