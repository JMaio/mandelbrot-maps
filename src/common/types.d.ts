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
  zoom: ZoomType;
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

export interface WebGLUniforms {
  zoom: OpaqueInterpolation<ZoomType>;
  xy: OpaqueInterpolation<XYType>;
  maxI: number;
  screenScaleMultiplier: number;
}

export interface DefaultRendererProps {
  controls: ViewerControls;
}
