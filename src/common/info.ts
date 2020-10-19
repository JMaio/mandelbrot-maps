import { CardProps } from '@material-ui/core';
import { OpaqueInterpolation } from 'react-spring';
import {
  ThetaType,
  ViewerRotationControlSpring,
  ViewerXYControlSpring,
  ViewerZoomControlSpring,
  XYType,
  ZoomType,
} from './types';

export interface FPSCardProps {
  fps: string;
  show: boolean;
}

export interface CoordinatesCardProps extends CardProps {
  show: boolean;
  // screenScaleMultiplier: number;
  mandelbrot: {
    xy: OpaqueInterpolation<XYType>;
    zoom: OpaqueInterpolation<ZoomType>;
    theta: OpaqueInterpolation<ThetaType>;
  };
  julia?: OpaqueInterpolation<XYType>;
}

export interface ViewerControls {
  xyCtrl: ViewerXYControlSpring;
  rotCtrl: ViewerRotationControlSpring;
  zoomCtrl: ViewerZoomControlSpring;
}

export interface ChangeCoordinatesCardProps extends CardProps {
  show: boolean;
  // screenScaleMultiplier: number;
  mandelbrot: ViewerControls;
  julia?: OpaqueInterpolation<XYType>;
}
