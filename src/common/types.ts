import { CSSProperties } from 'react';
import { SpringConfig, SpringRef, SpringValue, SpringValues } from 'react-spring';

// from react-spring
export type OverwriteKeys<A, B> = { [K in keyof A]: K extends keyof B ? B[K] : A[K] };

export interface SpringControl {
  config?: SpringConfig;
}

export type springConfigKeys = 'default' | 'user';
export type springPropertyKeys = 'xy' | 'zoom' | 'rot';
export type springControlKeys = 'xyCtrl' | 'zoomCtrl' | 'rotCtrl';

export type XYType = [number, number];
export type ZoomType = number;
export type ThetaType = number;

/** An RGB colour in range [0, 255], maps to range [0, 1] by applying (x / 255) */
export type RgbFloatColour = [number, number, number];

/**
 * Used to change between precision values (normal / deep mode)
 */
export interface precisionSpecifier {
  // react-spring precision
  default: number;
  // x, y coordinates
  floatFixed: number;
  // zoom, theta
  shortFloatFixed: number;
}

export interface precisionFormatterInterface {
  toFloatDisplay: (n: number) => number;
  toFloatDisplayFixed: (n: number) => string;
  toFloatDisplayShort: (n: number) => string;
}

/**
 * Holds viewer location data (can be used to control a view)
 */
export interface ViewerLocation {
  xy: XYType;
  z: ZoomType;
  theta: ThetaType;
}

export interface ViewerXYControl extends SpringControl {
  xy: XYType;
}

export interface ViewerZoomControl extends SpringControl {
  z: ZoomType;
  // last_pointer_dist: 0,
  minZoom: ZoomType;
  maxZoom: ZoomType;
}

export interface ViewerRotationControl extends SpringControl {
  theta: ThetaType;
}

export interface ViewerControls {
  xy: ViewerXYControl;
  zoom: ViewerZoomControl;
  rot: ViewerRotationControl;
}

// AnimatedValue<Pick<OverwriteKeys<ViewerXYControl, CSSProperties>, "xy">>, SetUpdateFn<OverwriteKeys<ViewerXYControl, CSSProperties>>]
export type SpringAnimatedValueOverwrite<T> = OverwriteKeys<T, CSSProperties>;
export type SpringAnimatedValueWithSetter<T extends SpringControl> = [
  SpringValues<T>,
  SpringRef<T>,
];
// [
//   AnimatedValue<Pick<SpringAnimatedValueOverwrite<T>, keyof T>>,
//   SetUpdateFn<SpringAnimatedValueOverwrite<T>>,
// ];

// export type ViewerXYControlSpring = SpringAnimatedValueWithSetter<ViewerXYControl>;
// export type ViewerZoomControlSpring = SpringAnimatedValueWithSetter<ViewerZoomControl>;
// export type ViewerRotationControlSpring = SpringAnimatedValueWithSetter<ViewerRotationControl>;

// export type ViewerControlSpringsKeys = {
//   [k in springControlKeys]: SpringAnimatedValueWithSetter[k];
// };

export interface ViewerControlSprings extends Record<springControlKeys, any> {
  xyCtrl: SpringAnimatedValueWithSetter<ViewerXYControl>;
  zoomCtrl: SpringAnimatedValueWithSetter<ViewerZoomControl>;
  rotCtrl: SpringAnimatedValueWithSetter<ViewerRotationControl>;
}

export interface MandelbrotMapsWebGLUniforms {
  xy: SpringValue<XYType>;
  zoom: SpringValue<ZoomType>;
  maxI: number;
  c?: { get: () => XYType };
  theta: SpringValue<ThetaType>;
  colour: RgbFloatColour;
}

export interface DefaultRendererProps {
  controls: ViewerControls;
}

export type ReactUseStateType<T> = [T, React.Dispatch<React.SetStateAction<T>>];
