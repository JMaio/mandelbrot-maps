import { Button } from '@material-ui/core';
import React from 'react';
import { ZoomCardProps } from '../../common/tans';
import { AnimationStatus } from './AnimationFinalCard';
import { KeyboardArrowLeft } from '@material-ui/icons';
import { KeyboardArrowRight } from '@material-ui/icons';
import { ZoomType, ThetaType } from '../../common/types';
import { warpToPoint } from '../../common/utils';

const INITIAL_ZOOM = 1;

const ActionText = {
  '-1': 'null',
  0: 'CONFIRM',
  1: 'CONFIRM',
  2: 'MAGNIFY',
  3: 'MAGNIFY',
  4: 'ROTATE',
  5: 'ROTATE',
  6: 'null',
};

const SimilarityAnimationButtons = (props: ZoomCardProps): JSX.Element => {
  const zoomM: ZoomType = props.focusedPointMandelbrot.factorMagnitude * INITIAL_ZOOM;
  const zoomJ: ZoomType = props.focusedPointJulia.factorMagnitude * INITIAL_ZOOM;
  const thetaM: ThetaType = -props.focusedPointMandelbrot.factorAngle;
  const thetaJ: ThetaType = -props.focusedPointJulia.factorAngle;

  const selectMandelbrot = () => {
    props.setAnimationState(AnimationStatus.SELECT_JULIA_POINT);
    warpToPoint(props.mandelbrotControls, {
      xy: props.focusedPointMandelbrot.point,
      z: 1,
      theta: 0,
    });
    warpToPoint(props.juliaControls, {
      xy: [0, 0],
      z: 0.5,
      theta: 0,
    });
  };

  const backSelectMandelbrot = () => {
    props.handleQuit();
  };

  const selectJulia = () => {
    props.setAnimationState(AnimationStatus.ZOOM_M);
    warpToPoint(props.juliaControls, {
      xy: props.focusedPointJulia.point,
      z: 1,
      theta: 0,
    });
  };

  const backSelectJulia = () => {
    props.setAnimationState(AnimationStatus.SELECT_MANDELBROT_POINT);
    warpToPoint(props.mandelbrotControls, {
      xy: props.focusedPointMandelbrot.point,
      z: 1,
      theta: 0,
    });
    warpToPoint(props.juliaControls, {
      xy: [0, 0],
      z: 0.5,
      theta: 0,
    });
  };

  const magnifyMandelbrot = () => {
    props.setAnimationState(AnimationStatus.ZOOM_J);

    warpToPoint(props.mandelbrotControls, {
      xy: props.focusedPointMandelbrot.point,
      z: zoomM,
      theta: 0,
    });
  };

  const backMagnifyMandelbrot = () => {
    props.setAnimationState(AnimationStatus.SELECT_JULIA_POINT);

    warpToPoint(props.juliaControls, {
      xy: [0, 0],
      z: 0.5,
      theta: 0,
    });
  };

  const magnifyJulia = () => {
    props.setAnimationState(AnimationStatus.ROTATE_M);

    warpToPoint(props.juliaControls, {
      xy: props.focusedPointJulia.point,
      z: zoomJ,
      theta: 0,
    });
  };

  const backMagnifyJulia = () => {
    props.setAnimationState(AnimationStatus.ZOOM_M);

    warpToPoint(props.mandelbrotControls, {
      xy: props.focusedPointMandelbrot.point,
      z: 1,
      theta: 0,
    });
  };

  const rotateMandelbrot = () => {
    props.setAnimationState(AnimationStatus.ROTATE_J);

    warpToPoint(props.mandelbrotControls, {
      xy: props.focusedPointMandelbrot.point,
      z: zoomM,
      theta: thetaM,
    });
  };

  const backRotateMandelbrot = () => {
    props.setAnimationState(AnimationStatus.ZOOM_J);

    warpToPoint(props.juliaControls, {
      xy: props.focusedPointJulia.point,
      z: 1,
      theta: 0,
    });
  };

  const rotateJulia = () => {
    props.setAnimationState(AnimationStatus.PLAY);

    warpToPoint(props.juliaControls, {
      xy: props.focusedPointJulia.point,
      z: zoomJ,
      theta: thetaJ,
    });
  };

  const backRotateJulia = () => {
    props.setAnimationState(AnimationStatus.ROTATE_M);

    warpToPoint(props.mandelbrotControls, {
      xy: props.focusedPointMandelbrot.point,
      z: zoomM,
      theta: 0,
    });
  };

  const onClick = () => {
    switch (props.animationState) {
      case AnimationStatus.SELECT_MANDELBROT_POINT:
        backSelectMandelbrot();
        break;
      case AnimationStatus.SELECT_JULIA_POINT:
        backSelectJulia();
        break;
      case AnimationStatus.ZOOM_M:
        backMagnifyMandelbrot();
        break;
      case AnimationStatus.ZOOM_J:
        backMagnifyJulia();
        break;
      case AnimationStatus.ROTATE_M:
        backRotateMandelbrot();
        break;
      case AnimationStatus.ROTATE_J:
        backRotateJulia();
        break;
      default:
        break;
    }
  };

  return (
    <div
      style={{
        zIndex: 1400,
        display: 'flex',
        flexDirection: 'row',
        flexShrink: 1,
      }}
    >
      {props.animationState === AnimationStatus.SELECT_MANDELBROT_POINT ? (
        <Button color="secondary" onClick={onClick}>
          Quit
        </Button>
      ) : (
        <Button onClick={onClick}>
          <KeyboardArrowLeft />
          Back
        </Button>
      )}
      <div style={{ height: '100%', width: '100%' }}>
        <Button
          style={{ height: '100%', float: 'right' }}
          onClick={() => {
            switch (props.animationState) {
              case AnimationStatus.SELECT_MANDELBROT_POINT:
                selectMandelbrot();
                break;
              case AnimationStatus.SELECT_JULIA_POINT:
                selectJulia();
                break;
              case AnimationStatus.ZOOM_M:
                magnifyMandelbrot();
                break;
              case AnimationStatus.ZOOM_J:
                magnifyJulia();
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
        >
          {ActionText[props.animationState]}
          <KeyboardArrowRight />
        </Button>
      </div>
    </div>
  );
};

export default SimilarityAnimationButtons;
