import { CardProps } from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import {
  AnimatedValue,
  ForwardedProps,
  OpaqueInterpolation,
  SetUpdateFn,
} from 'react-spring';
import {
  ViewerRotationControl,
  ViewerXYControl,
  ViewerZoomControl,
  XYType,
} from './types';

// from react-spring
export type OverwriteKeys<A, B> = { [K in keyof A]: K extends keyof B ? B[K] : A[K] };

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

export interface MandelbrotControls {
  xyCtrl: [
    AnimatedValue<Pick<OverwriteKeys<ViewerXYControl, React.CSSProperties>, 'xy'>>,
    SetUpdateFn<OverwriteKeys<ViewerXYControl, React.CSSProperties>>,
  ];
  rotCtrl: [
    AnimatedValue<
      Pick<OverwriteKeys<ViewerRotationControl, React.CSSProperties>, 'theta'>
    >,
    SetUpdateFn<OverwriteKeys<ViewerRotationControl, React.CSSProperties>>,
  ];
  zoomCtrl: [
    AnimatedValue<
      Pick<
        OverwriteKeys<ViewerZoomControl, React.CSSProperties>,
        'zoom' | 'minZoom' | 'maxZoom'
      >
    >,
    SetUpdateFn<OverwriteKeys<ViewerZoomControl, React.CSSProperties>>,
  ];
}

export interface ChangeCoordinatesCardProps extends CardProps {
  show: boolean;
  screenScaleMultiplier: number;
  mandelbrot: MandelbrotControls;
  julia?: OpaqueInterpolation<XYType>;
}
