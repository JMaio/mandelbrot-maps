import React, { useRef, useState } from 'react';
import { useGesture } from 'react-use-gesture';
import { MandelbrotRendererProps } from '../../common/render';
import { MandelbrotMapsWebGLUniforms } from '../../common/types';
import { genericTouchBind, Rgb255ColourToFloat } from '../../common/utils';
import newSmoothMandelbrotShader, {
  miniCrosshair,
  standardCrosshair,
} from '../../shaders/newSmoothMandelbrotShader';
import FPSCard from '../info/FPSCard';
import { SettingsContext } from '../settings/SettingsContext';
import MinimapViewer from './MinimapViewer';
import WebGLCanvas from './WebGLCanvas';

export default function MandelbrotRenderer({
  precision,
  ...props
}: MandelbrotRendererProps): JSX.Element {
  // variables to hold canvas and webgl information
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const miniCanvasRef = useRef<HTMLCanvasElement>(null);

  // const gl = useRef<WebGLRenderingContext>(null);
  // const miniGl = useRef<WebGLRenderingContext>(null);

  // this multiplier subdivides the screen space into smaller increments
  // to allow for velocity calculations to not immediately decay, due to the
  // otherwise small scale that is being mapped to the screen.
  // const screenScaleMultiplier = props.screenScaleMultiplier; // -> global

  // temporary bounds to prevent excessive panning
  // eslint-disable-next-line
  // const radialBound = 1;
  // const relativeRadialBound = radialBound;// / -screenScaleMultiplier;

  // read incoming props
  const [{ xy }] = props.controls.xyCtrl;
  // const [{ theta, last_pointer_angle }, setControlRot] = props.controls.rot;
  const [{ z }] = props.controls.zoomCtrl;
  const [{ theta }] = props.controls.rotCtrl;
  const maxI = props.maxI; // -> global
  const AA = props.useAA ? 2 : 1; // -> global

  const fragShader = newSmoothMandelbrotShader(
    {
      maxI: maxI,
      AA: AA,
    },
    props.showCrosshair,
    standardCrosshair,
  );
  const miniFragShader = newSmoothMandelbrotShader(
    {
      maxI: maxI,
      AA: 2,
    },
    props.showCrosshair,
    miniCrosshair,
  );

  const u: MandelbrotMapsWebGLUniforms = {
    zoom: z,
    xy: xy,
    theta: theta,
    maxI: maxI,
    colour: Rgb255ColourToFloat(props.colour), // vec3(0.0,0.6,1.0)
    // screenScaleMultiplier: screenScaleMultiplier,
  };

  const [dragging, setDragging] = useState(false);

  const gtb = genericTouchBind({
    domTarget: canvasRef,
    controls: props.controls,
    // gl: gl,
    setDragging: setDragging,
    DPR: props.DPR,
    precision: precision,
  });

  // https://use-gesture.netlify.app/docs/changelog/#breaking
  // When adding events directly to the dom element using `domTarget`
  // you no longer need to clean the effect yourself.
  // const touchBind =
  useGesture(gtb.handlers, gtb.config);

  // useEffect(() => {
  //   touchBind();
  // }, [touchBind]);

  const [FPS, setFPS] = useState('');

  return (
    <SettingsContext.Consumer>
      {({ settings }) => (
        <div
          className="renderer"
          style={{
            position: 'relative',
          }}
        >
          <FPSCard FPS={FPS} show={settings.showFPS} />
          <WebGLCanvas
            id="mandelbrot-canvas"
            fragShader={fragShader}
            DPR={props.DPR}
            // touchBind={touchBind}
            u={u}
            ref={canvasRef}
            // glRef={gl}
            setFPS={setFPS}
            dragging={dragging}
          />
          <MinimapViewer
            id="mandelbrot-minimap-canvas"
            fragShader={miniFragShader}
            DPR={props.DPR}
            u={u}
            canvasRef={miniCanvasRef}
            // glRef={miniGl}
            show={settings.showMinimap}
            controls={props.controls}
          />
        </div>
      )}
    </SettingsContext.Consumer>
  );
}
