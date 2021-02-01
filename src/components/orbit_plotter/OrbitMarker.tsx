import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import { ViewerControlSprings } from '../../common/types';
import { animated } from 'react-spring';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { XYType } from '../../common/types';

const MARKER_SIZE = 25;

const complexToScreenCoordinate = (
  x: number,
  y: number,
  angle: number,
  zoom: number,
  boxWidth: number,
  boxHeight: number,
  c: XYType,
): XYType => {
  const distanceX = c[0] - x;
  const distanceY = c[1] - y;
  return [
    (boxHeight / 2) *
      ((distanceX * Math.cos(angle) - distanceY * Math.sin(angle)) * zoom + boxWidth),
    (boxHeight / 2) *
      ((distanceX * Math.sin(angle) + distanceY * Math.cos(angle)) * zoom + 1),
  ];
};

type OrbitMarkerProps = {
  rendererWidth: number;
  rendererHeight: number;
  point: XYType;
  mandelbrotControl: ViewerControlSprings;
  color: string;
};

const OrbitMarker = (props: OrbitMarkerProps): JSX.Element => {
  const [{ z }] = props.mandelbrotControl.zoomCtrl;
  const [{ theta }] = props.mandelbrotControl.rotCtrl;

  const ASPECT_RATIO = props.rendererWidth / props.rendererHeight;

  return (
    <animated.div
      style={{
        zIndex: 100,
        position: 'absolute',
        left: props.mandelbrotControl.xyCtrl[0].xy.interpolate(
          // @ts-expect-error: Function call broken in TS, waiting till react-spring v9 to fix
          (x, y) => {
            return (
              complexToScreenCoordinate(
                x,
                y,
                -theta.getValue(),
                z.getValue(),
                ASPECT_RATIO,
                props.rendererHeight,
                props.point,
              )[0] - MARKER_SIZE
            );
          },
        ),
        bottom: props.mandelbrotControl.xyCtrl[0].xy.interpolate(
          // @ts-expect-error: Function call broken in TS, waiting till react-spring v9 to fix
          (x, y) => {
            return (
              complexToScreenCoordinate(
                x,
                y,
                -theta.getValue(),
                z.getValue(),
                ASPECT_RATIO,
                props.rendererHeight,
                props.point,
              )[1] - MARKER_SIZE
            );
          },
        ),
      }}
    >
      <IconButton style={{ color: props.color }}>
        <FiberManualRecordIcon style={{ width: MARKER_SIZE, height: MARKER_SIZE }} />
      </IconButton>
    </animated.div>
  );
};

export default OrbitMarker;
