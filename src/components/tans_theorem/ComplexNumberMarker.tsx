import React from 'react';
import { Tooltip } from '@material-ui/core';
import RoomIcon from '@material-ui/icons/Room';
import IconButton from '@material-ui/core/IconButton';
import { ComplexNumberMarkerProps } from '../../common/tans';
import { XYType } from '../../common/types';

const BUTTON_SIZE = 40;
const BUTTON_OFFSET_X = (3 * BUTTON_SIZE) / 4;
const BUTTON_OFFSET_Y = BUTTON_SIZE / 4;

const FOCUSED_POINT_COLOR = '#f21616';
const UNFOCUSED_POINT_COLOR = '#edeb4e';

const complexToWindow = (
  m: XYType,
  angle: number,
  zoom: number,
  aspectRatio: number,
  boxCentre: XYType,
): XYType => {
  const distanceX = boxCentre[0] - m[0];
  const distanceY = boxCentre[1] - m[1];

  return [
    (aspectRatio * zoom * (distanceX * Math.cos(angle) - distanceY * Math.sin(angle)) +
      1) /
      2,
    (zoom * (distanceX * Math.sin(angle) + distanceY * Math.cos(angle)) + 1) / 2,
  ];
};

const ComplexNumberMarker = (props: ComplexNumberMarkerProps): JSX.Element => {
  const [{ z }] = props.viewerControl.zoomCtrl;
  const [{ theta }] = props.viewerControl.rotCtrl;

  const coord = complexToWindow(
    props.viewerControl.xyCtrl[0].xy.getValue(),
    -theta.getValue(),
    z.getValue(),
    props.aspectRatio,
    props.m.point,
  );

  return (
    <div
      style={{
        zIndex: 1,
        position: 'absolute',
        left: `${coord[0] * 100}%`,
        bottom: `${coord[1] * 100}%`,
      }}
    >
      <Tooltip title={`${props.m.toString()}`} placement="top">
        <IconButton
          style={{
            position: 'absolute',
            left: -BUTTON_OFFSET_X,
            bottom: -BUTTON_OFFSET_Y,
            color: props.isFocused ? FOCUSED_POINT_COLOR : UNFOCUSED_POINT_COLOR,
          }}
          onClick={() => {
            props.onClick();
          }}
        >
          <RoomIcon style={{ width: BUTTON_SIZE, height: BUTTON_SIZE }} />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default ComplexNumberMarker;
