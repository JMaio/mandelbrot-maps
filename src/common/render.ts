import { CanvasHTMLAttributes } from 'react';
import { MandelbrotMapsWebGLUniforms } from './types';
/**
 * Props for the WebGLCanvas component
 *
 * @param mini - Controls whether this component should display as a minimap
 * @param glRef - The reference to the canvas to be used with a WebGL context
 * @param u - Uniforms to be passed down to the WebGL context
 *
 */
export interface WebGLCanvasProps extends CanvasHTMLAttributes<HTMLCanvasElement> {
  glRef: React.MutableRefObject<WebGLRenderingContext>;
  // the WebGL uniforms required for the shader - position, zoom, etc
  u: MandelbrotMapsWebGLUniforms;
  /** The fragment shader to be used */
  fragShader?: any;

  fps?: any;
  /** The device pixel ratio to be used can be overwritten with this value */
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
