import { MandelbrotMapsWebGLUniforms } from './types';
import { Property } from 'csstype';
import { OpaqueInterpolation } from 'react-spring';
/**
 * Props for the WebGLCanvas component
 *
 * @param mini - Controls whether this component should display as a minimap
 * @param glRef - The reference to the canvas to be used with a WebGL context
 * @param u - Uniforms to be passed down to the WebGL context
 *
 */
export interface WebGLCanvasProps {
  glRef: React.MutableRefObject<WebGLRenderingContext>;
  u: MandelbrotMapsWebGLUniforms;

  fragShader?: any;
  fps?: any;
  dpr?: number;
  dragging?: boolean;
  // mini?: boolean;
  // children?: ReactNode;
}

export interface MinimapViewerProps extends WebGLCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onClick: () => void;
  //   dpr: number;
  //   u: MandelbrotMapsWebGLUniforms;

  //   fragShader: any;
  //   glRef: React.MutableRefObject<HTMLCanvasElement>;
}
