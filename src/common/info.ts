import { CardProps } from '@material-ui/core';
import { OpaqueInterpolation } from 'react-spring';
import { ThetaType, ViewerControlSprings, XYType, ZoomType } from './types';

export interface FPSCardProps {
  fps: string;
  show: boolean;
}

export interface CoordinatesCardProps extends CardProps {
  mandelbrot: {
    xy: OpaqueInterpolation<XYType>;
    zoom: OpaqueInterpolation<ZoomType>;
    theta: OpaqueInterpolation<ThetaType>;
  };
  julia?: OpaqueInterpolation<XYType>;
}

export interface ChangeCoordinatesCardProps extends CardProps {
  mandelbrot: ViewerControlSprings;
  julia?: OpaqueInterpolation<XYType>;
}
