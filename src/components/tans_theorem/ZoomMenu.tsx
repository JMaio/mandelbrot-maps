import { Card, Button } from '@material-ui/core';
import React from 'react';
import { ZoomCardProps } from '../../common/tans';
import { AnimationStatus } from './AnimationFinalCard';
import { KeyboardArrowLeft } from '@material-ui/icons';
import { KeyboardArrowRight } from '@material-ui/icons';
import { ZoomType, ThetaType } from '../../common/types';
import { warpToPoint } from '../../common/utils';

const INITIAL_ZOOM = 1;

const ZoomMenu = (props: ZoomCardProps): JSX.Element => {
  const ActionText = {
    '-1': 'null',
    0: 'null',
    1: 'null',
    2: 'MAGNIFY',
    3: 'MAGNIFY',
    4: 'ROTATE',
    5: 'ROTATE',
    6: 'null',
  };

  const zoomMandelbrot = () => {
    props.setAnimationState(AnimationStatus.ZOOM_J);
    const zoomM: ZoomType = props.focusedPointMandelbrot.factorMagnitude * INITIAL_ZOOM;

    warpToPoint(props.mandelbrotControls, {
      xy: props.focusedPointMandelbrot.point,
      z: zoomM,
      theta: 0,
    });
  };

  const zoomJulia = () => {
    props.setAnimationState(AnimationStatus.ROTATE_M);

    const zoomJ: ZoomType = props.focusedPointJulia.factorMagnitude * INITIAL_ZOOM;

    warpToPoint(props.juliaControls, {
      xy: props.focusedPointJulia.point,
      z: zoomJ,
      theta: 0,
    });
  };

  const rotateMandelbrot = () => {
    props.setAnimationState(AnimationStatus.ROTATE_J);

    const zoomM: ZoomType = props.focusedPointMandelbrot.factorMagnitude * INITIAL_ZOOM;
    const thetaM: ThetaType = -props.focusedPointMandelbrot.factorAngle;

    warpToPoint(props.mandelbrotControls, {
      xy: props.focusedPointMandelbrot.point,
      z: zoomM,
      theta: thetaM,
    });
  };

  const rotateJulia = () => {
    props.setAnimationState(AnimationStatus.PLAY);

    const zoomJ: ZoomType = props.focusedPointJulia.factorMagnitude * INITIAL_ZOOM;
    const thetaJ: ThetaType = -props.focusedPointJulia.factorAngle;

    warpToPoint(props.juliaControls, {
      xy: props.focusedPointJulia.point,
      z: zoomJ,
      theta: thetaJ,
    });
  };

  return (
    <Card
      style={{
        zIndex: 1400,
        display: 'flex',
        flexDirection: 'row',
        flexShrink: 1,
        marginBottom: 8,
      }}
    >
      <Button onClick={props.handleQuit}>
        <KeyboardArrowLeft />
        Back
      </Button>
      <div style={{ height: '100%', width: '100%' }}>
        <Button
          style={{ height: '100%', float: 'right' }}
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
        >
          {ActionText[props.animationState]}
          <KeyboardArrowRight />
        </Button>
      </div>
    </Card>
  );
};

export default ZoomMenu;
