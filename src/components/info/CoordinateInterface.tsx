import { Grow } from '@material-ui/core';
import React from 'react';
import { CoordinateInterfaceProps } from '../../common/info';
import ChangeCoordinatesCard from './ChangeCoordinatesCard';
import CoordinatesCard from './CoordinatesCard';

export const CoordinateInterface = ({
  mandelbrot,
  precision,
  precisionFormatter,
  show,
}: CoordinateInterfaceProps): JSX.Element => {
  const {
    // props.mandelbrot.xyCtrl[0].xy,
    xyCtrl: [{ xy }],
    // props.mandelbrot.zoomCtrl[0].z,
    zoomCtrl: [{ z }],
    // props.mandelbrot.rotCtrl[0].theta,
    rotCtrl: [{ theta }],
  } = mandelbrot;
  return (
    <Grow
      in={show}
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
            xy: xy,
            zoom: z,
            theta: theta,
          }}
          precisionFormatter={precisionFormatter}
        />
        <ChangeCoordinatesCard mandelbrot={mandelbrot} precision={precision} />
      </div>
    </Grow>
  );
};

export default CoordinateInterface;
