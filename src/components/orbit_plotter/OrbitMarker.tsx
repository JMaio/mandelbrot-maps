import React from 'react';
import { ViewerControlSprings } from '../../common/types';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { XYType } from '../../common/types';

const MARKER_SIZE = 20;

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
  show: boolean;
};

const OrbitMarker = (props: OrbitMarkerProps): JSX.Element => {
  const [{ z }] = props.mandelbrotControl.zoomCtrl;
  const [{ theta }] = props.mandelbrotControl.rotCtrl;

  const ASPECT_RATIO = props.rendererWidth / props.rendererHeight;

  return (
    <FiberManualRecordIcon
      style={{
        visibility: props.show ? 'visible' : 'hidden',
        zIndex: 100,
        position: 'absolute',
        left:
          complexToScreenCoordinate(
            props.mandelbrotControl.xyCtrl[0].xy.getValue()[0],
            props.mandelbrotControl.xyCtrl[0].xy.getValue()[1],
            -theta.getValue(),
            z.getValue(),
            ASPECT_RATIO,
            props.rendererHeight,
            props.point,
          )[0] -
          MARKER_SIZE / 2,
        bottom:
          complexToScreenCoordinate(
            props.mandelbrotControl.xyCtrl[0].xy.getValue()[0],
            props.mandelbrotControl.xyCtrl[0].xy.getValue()[1],
            -theta.getValue(),
            z.getValue(),
            ASPECT_RATIO,
            props.rendererHeight,
            props.point,
          )[1] -
          (5 * MARKER_SIZE) / 8,
        color: props.color,
        width: MARKER_SIZE,
        height: MARKER_SIZE,
      }}
    />
  );
};

export default OrbitMarker;
