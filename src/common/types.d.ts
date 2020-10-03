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

// export type SpringAnimatedValueWithSetter<T> = [AnimatedValue<T>, SetUpdateFn<T>];

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
