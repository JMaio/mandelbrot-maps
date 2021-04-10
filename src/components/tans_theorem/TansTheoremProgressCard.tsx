import { Card } from '@material-ui/core';
import React from 'react';
import { TansTheoremProgressCardProps } from '../../common/tans';
import SimilarityAnimationStepper from './SimilarityAnimationStepper';
import SimilarityAnimationButtons from './SimilarityAnimationButtons';
import { warpToPoint } from '../../common/utils';

const TansTheoremProgressCard = (props: TansTheoremProgressCardProps): JSX.Element => {
  return (
    <Card
      style={{
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 1,
      }}
    >
      <SimilarityAnimationStepper
        animationState={props.animationState}
        focusedPointMandelbrot={props.focusedPointMandelbrot}
        focusedPointJulia={props.focusedPointJulia}
        pointsMandelbrot={props.pointsMandelbrot}
        pointsJulia={props.pointsJulia}
        handlePointSelectionMandelbrot={(c) => {
          props.handlePointSelectionMandelbrot(c);
          warpToPoint(props.mandelbrotControls, {
            xy: c.point,
            z: c.factorMagnitude,
            theta: 0,
          });
        }}
        handlePointSelectionJulia={props.handlePointSelectionJulia}
      />
      <SimilarityAnimationButtons
        handleQuit={props.handleQuit}
        mandelbrotControls={props.mandelbrotControls}
        juliaControls={props.juliaControls}
        animationState={props.animationState}
        setAnimationState={props.setAnimationState}
        focusedPointMandelbrot={props.focusedPointMandelbrot}
        focusedPointJulia={props.focusedPointJulia}
      />
    </Card>
  );
};

export default TansTheoremProgressCard;
