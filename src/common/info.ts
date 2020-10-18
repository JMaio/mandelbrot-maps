import { CardProps } from '@material-ui/core';
import { AnimatedValue, OpaqueInterpolation, SetUpdateFn } from 'react-spring';
import {
  SpringAnimatedValueWithSetter,
  ThetaType,
  ViewerRotationControl,
  ViewerRotationControlSpring,
  ViewerXYControl,
  ViewerXYControlSpring,
  ViewerZoomControl,
  ViewerZoomControlSpring,
  XYType,
  ZoomType,
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
  mandelbrot: {
    xy: OpaqueInterpolation<XYType>;
    zoom: OpaqueInterpolation<ZoomType>;
    theta: OpaqueInterpolation<ThetaType>;
  };
  julia?: OpaqueInterpolation<XYType>;
}

export interface MandelbrotControls {
  // xyCtrl: SpringAnimatedValueWithSetter<ViewerXYControl>;
  // // [
  // //   AnimatedValue<Pick<OverwriteKeys<ViewerXYControl, React.CSSProperties>, 'xy'>>,
  // //   SetUpdateFn<OverwriteKeys<ViewerXYControl, React.CSSProperties>>,
  // // ];
  // rotCtrl: [
  //   AnimatedValue<
  //     Pick<OverwriteKeys<ViewerRotationControl, React.CSSProperties>, 'theta'>
  //   >,
  //   SetUpdateFn<OverwriteKeys<ViewerRotationControl, React.CSSProperties>>,
  // ];
  // zoomCtrl: [
  //   AnimatedValue<
  //     Pick<
  //       OverwriteKeys<ViewerZoomControl, React.CSSProperties>,
  //       'z' | 'minZoom' | 'maxZoom'
  //     >
  //   >,
  //   SetUpdateFn<OverwriteKeys<ViewerZoomControl, React.CSSProperties>>,
  // ];
  xyCtrl: ViewerXYControlSpring;
  rotCtrl: ViewerZoomControlSpring;
  zoomCtrl: ViewerRotationControlSpring;
}

export interface ChangeCoordinatesCardProps extends CardProps {
  show: boolean;
  screenScaleMultiplier: number;
  mandelbrot: MandelbrotControls;
  julia?: OpaqueInterpolation<XYType>;
}
