import { CanvasHTMLAttributes } from 'react';
import { MandelbrotMapsWebGLUniforms } from './types';

export interface WebGLCanvasProps extends CanvasHTMLAttributes<HTMLCanvasElement> {
  /** The reference to the WebGL context in the root canvas element  */
  glRef: React.MutableRefObject<WebGLRenderingContext>;
  /** WebGL Uniforms to be passed down to the shader - position, zoom, etc */
  u: MandelbrotMapsWebGLUniforms;
  /** The fragment shader to be used */
  fragShader?: any;

  fps?: any;
  /** The device pixel ratio to be used can be overwritten with this value? */
  dpr?: number;
  /** Should the DPR value be used? */
  useDPR?: boolean;
  /** Specify whether the viewer is being dragged on, to set the appropriate cursor. */
  dragging?: boolean;
}

export interface MinimapViewerProps extends WebGLCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onClick: () => void;
  show: boolean;
  //   dpr: number;
  //   u: MandelbrotMapsWebGLUniforms;

  //   fragShader: any;
  //   glRef: React.MutableRefObject<HTMLCanvasElement>;
}
