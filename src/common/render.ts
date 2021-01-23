import { CanvasHTMLAttributes } from 'react';
import { RgbColor } from 'react-colorful';
import { OpaqueInterpolation } from 'react-spring';
import { MandelbrotMapsWebGLUniforms, ViewerControlSprings, XYType } from './types';

export interface WebGLCanvasProps extends CanvasHTMLAttributes<HTMLCanvasElement> {
  /** The reference to the WebGL context in the root canvas element  */
  // glRef?: React.MutableRefObject<WebGLRenderingContext>;
  /** WebGL Uniforms to be passed down to the shader - position, zoom, etc */
  u: MandelbrotMapsWebGLUniforms;
  /** The fragment shader to be used */
  fragShader: string;
  /** The fps setter, provided by React useState, optional in Julia */
  fps?: React.Dispatch<React.SetStateAction<string>>;
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

export interface RendererProps {
  controls: ViewerControlSprings;
  maxI: number;
  useDPR: boolean;
  DPR: number;
  useAA: boolean;
  colour: RgbColor;
}

export interface RendererRenderValues {
  maxI?: number;
  AA?: number;
  B?: number;
}

export interface MandelbrotRendererProps extends RendererProps {
  showCrosshair: boolean;
}

export interface JuliaRendererProps extends RendererProps {
  c: OpaqueInterpolation<XYType>;
}

export interface MinimapViewerProps extends WebGLCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onClick: () => void;
  show: boolean;
  id?: string;
  //   dpr: number;
  //   u: MandelbrotMapsWebGLUniforms;

  //   fragShader: any;
  //   glRef: React.MutableRefObject<HTMLCanvasElement>;
}

export interface ViewChangerProps {
  vertical: boolean;
  changeFunc: React.Dispatch<React.SetStateAction<[boolean, boolean]>>;
}
