import { CardProps } from '@material-ui/core';
import { OpaqueInterpolation } from 'react-spring';
import { ThetaType, ViewerControlSprings, XYType, ZoomType } from './types';

export interface FPSCardProps {
  FPS: string;
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

export interface InfoDialogProps {
  // control whether the info dialog should be displayed
  ctrl: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}
