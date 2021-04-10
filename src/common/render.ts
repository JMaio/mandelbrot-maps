import { CanvasHTMLAttributes } from 'react';
import { RgbColor } from 'react-colorful';
import { OpaqueInterpolation } from 'react-spring';
import { AnimationStatus } from '../components/tans_theorem/AnimationFinalCard';
import {
  MandelbrotMapsWebGLUniforms,
  precisionSpecifier,
  ThetaType,
  ViewerControlSprings,
  XYType,
} from './types';

export interface WebGLCanvasProps extends CanvasHTMLAttributes<HTMLCanvasElement> {
  /** The reference to the WebGL context in the root canvas element  */
  // glRef?: React.MutableRefObject<WebGLRenderingContext>;
  /** WebGL Uniforms to be passed down to the shader - position, zoom, etc */
  u: MandelbrotMapsWebGLUniforms;
  /** The fragment shader to be used */
  fragShader: string;
  /** The fps setter, provided by React useState, optional in Julia */
  setFPS?: React.Dispatch<React.SetStateAction<string>>;
  /** The device pixel ratio to be used can be overwritten with this value? */
  DPR: number;
  /** Should the DPR value be used? */
  // useDPR?: boolean;
  /** Specify whether the viewer is being dragged on, to set the appropriate cursor. */
  dragging?: boolean;
  /** The HTML "id" to give to the canvas element, if any */
  id?: string;
  /** Should this be a mini viewer? */
  mini?: boolean;
}

export interface RendererProps extends React.StyleHTMLAttributes<HTMLDivElement> {
  controls: ViewerControlSprings;
  maxI: number;
  useDPR: boolean;
  DPR: number;
  useAA: boolean;
  colour: RgbColor;
  precision: precisionSpecifier;
}

export interface RendererRenderValues {
  maxI?: number;
  AA?: number;
  B?: number;
}

export interface MandelbrotRendererProps extends RendererProps {
  showCrosshair: boolean;
  animationState: AnimationStatus;
  showTan: boolean;
  align: (z: number) => void;
}

export interface JuliaRendererProps extends RendererProps {
  c: OpaqueInterpolation<XYType>;
  animationState: AnimationStatus;
  align: (z: number) => void;
}

export interface MinimapViewerProps extends WebGLCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  show: boolean;
  id?: string;

  controls: ViewerControlSprings;
  // zoomOnClick: () => void;
  // thetaOnClick: () => void;
  //   dpr: number;
  //   u: MandelbrotMapsWebGLUniforms;

  //   fragShader: any;
  //   glRef: React.MutableRefObject<HTMLCanvasElement>;
}

export interface ViewChangerProps {
  vertical: boolean;
  changeFunc: React.Dispatch<React.SetStateAction<[boolean, boolean]>>;
  /** use this toggle to make the component display nicely for showcase purposes */
  displayOnly?: boolean;
}

export interface RotationCompassProps {
  theta: OpaqueInterpolation<ThetaType>;
  onClick: () => void;
}
