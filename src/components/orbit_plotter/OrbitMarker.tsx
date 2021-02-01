import React from 'react';
import { Tooltip } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { ViewerControlSprings } from '../../common/types';
import { formatComplexNumber } from '../../common/complex_number_helper';
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
  show: boolean;
  mapWidth: number;
  mapHeight: number;
  iterate: XYType;
  mandelbrotControl: ViewerControlSprings;
  color: string;
};

const OrbitMarker = (props: OrbitMarkerProps): JSX.Element => {
  const [{ z }] = props.mandelbrotControl.zoomCtrl;
  const [{ theta }] = props.mandelbrotControl.rotCtrl;

  const ASPECT_RATIO = props.mapWidth / props.mapHeight;

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
                props.mapHeight,
                props.iterate,
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
                props.mapHeight,
                props.iterate,
              )[1] - MARKER_SIZE
            );
          },
        ),
      }}
    >
      <Tooltip title={`${formatComplexNumber(props.iterate)}`} placement="top">
        <IconButton style={{ color: props.color }}>
          <FiberManualRecordIcon style={{ width: MARKER_SIZE, height: MARKER_SIZE }} />
        </IconButton>
      </Tooltip>
    </animated.div>
  );
};

export default OrbitMarker;
