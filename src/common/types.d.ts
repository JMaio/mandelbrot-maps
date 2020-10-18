import { OpaqueInterpolation, SpringConfig } from 'react-spring';

interface SpringControl {
  config?: SpringConfig;
}

export type XYType = [number, number];
export type ZoomType = number;
export type ThetaType = number;

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
export type SpringAnimatedValueWithSetter<T> = [
  AnimatedValue<Pick<SpringAnimatedValueOverwrite<T>>, keyof T>,
  SetUpdateFn<SpringAnimatedValueOverwrite<T>>,
];

export type ViewerXYControlSpring = SpringAnimatedValueWithSetter<ViewerXYControl>;
export type ViewerZoomControlSpring = SpringAnimatedValueWithSetter<ViewerZoomControl>;
export type ViewerRotationControlSpring = SpringAnimatedValueWithSetter<
  ViewerRotationControl
>;

export interface MandelbrotMapsWebGLUniforms {
  xy: OpaqueInterpolation<XYType>;
  zoom: OpaqueInterpolation<ZoomType>;
  maxI: number;
  c?: {
    getValue: () => XYType;
  };
  screenScaleMultiplier: number;
  theta?: OpaqueInterpolation<ThetaType>;
}

export interface DefaultRendererProps {
  controls: ViewerControls;
}
