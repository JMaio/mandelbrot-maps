import { CardProps } from '@material-ui/core';
import { Interpolation, SpringValue } from 'react-spring';
import {
  precisionFormatterInterface,
  precisionSpecifier,
  ThetaType,
  ViewerControlSprings,
  XYType,
  ZoomType,
} from './types';

export interface FPSCardProps {
  FPS: string;
  show: boolean;
}

export interface CoordinateInterfaceProps {
  mandelbrot: ViewerControlSprings;
  precision: precisionSpecifier;
  precisionFormatter: precisionFormatterInterface;
  show: boolean;
}

export interface CoordinatesCardProps extends CardProps {
  mandelbrot: {
    xy: SpringValue<XYType>;
    zoom: SpringValue<ZoomType>;
    theta: SpringValue<ThetaType>;
  };
  julia?: SpringValue<XYType>;
  precisionFormatter: precisionFormatterInterface;
}

export interface ChangeCoordinatesCardProps extends CardProps {
  mandelbrot: ViewerControlSprings;
  julia?: SpringValue<XYType>;
  precision: precisionSpecifier;
}

export interface InfoDialogProps {
  // control whether the info dialog should be displayed
  ctrl: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}
