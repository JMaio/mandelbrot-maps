import { CardProps } from '@material-ui/core';
import { OpaqueInterpolation } from 'react-spring';
import { XYType } from './types';

export interface FPSCardProps {
  fps: number;
  show: boolean;
}

export interface CoordinatesCardProps extends CardProps {
  show: boolean;
  screenScaleMultiplier: number;
  mandelbrot: OpaqueInterpolation<XYType>;
  julia?: OpaqueInterpolation<XYType>;
}
