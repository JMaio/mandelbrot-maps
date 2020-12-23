import { Grow } from '@material-ui/core';
import React from 'react';
import { ViewerControlSprings } from '../../common/types';
import ChangeCoordinatesCard from './ChangeCoordinatesCard';
import CoordinatesCard from './CoordinatesCard';

export const CoordinateInterface = (props: {
  mandelbrot: ViewerControlSprings;
  show: boolean;
}): JSX.Element => {
  return (
    <Grow
      in={props.show}
      style={{
        position: 'absolute',
        right: 0,
        top: 0,
        margin: 20,
        width: 'auto',
        zIndex: 1,
      }}
    >
      <div>
        <CoordinatesCard
          mandelbrot={{
            xy: props.mandelbrot.xyCtrl[0].xy,
            zoom: props.mandelbrot.zoomCtrl[0].z,
            theta: props.mandelbrot.rotCtrl[0].theta,
          }}
        />
        <ChangeCoordinatesCard mandelbrot={props.mandelbrot} />
      </div>
    </Grow>
  );
};

export default CoordinateInterface;
