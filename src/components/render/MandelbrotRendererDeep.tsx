import React, { useRef, useState } from 'react';
import { useGesture } from 'react-use-gesture';
import { MandelbrotRendererProps } from '../../common/render';
import { MandelbrotMapsWebGLUniforms } from '../../common/types';
import {
  genericTouchBind,
  Rgb255ColourToFloat,
  synchronisedZoomTouchBind,
  frozenTouchBind,
} from '../../common/utils';
import mandelbrotShaderDeep from '../../shaders/mandelbrotShaderDeep';
import newSmoothMandelbrotShader, {
  miniCrosshair,
  standardCrosshair,
} from '../../shaders/newSmoothMandelbrotShader';
import FPSCard from '../info/FPSCard';
import { SettingsContext } from '../settings/SettingsContext';
import MinimapViewer from './MinimapViewer';
import WebGLCanvasDeep from './WebGLCanvasDeep';
import { AnimationStatus } from '../tans_theorem/AnimationFinalCard';

export default function MandelbrotRendererDeep({
  controls,
  maxI,
  useAA,
  DPR,
  showCrosshair,
  colour,
  style,
  precision,
  animationState,
  align,
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
  // read incoming props
  const [{ xy }] = controls.xyCtrl;
  // const [{ theta, last_pointer_angle }, setControlRot] = props.controls.rot;
  const [{ z }] = controls.zoomCtrl;
  const [{ theta }] = controls.rotCtrl;
  // const maxI = props.maxI; // -> global
  const AA = useAA ? 2 : 1; // -> global

  // const fragShader = newSmoothMandelbrotShader(
  //   {
  //     maxI: maxI,
  //     AA: AA,
  //   },
  //   showCrosshair,
  //   standardCrosshair,
  // );
  const fragShader = mandelbrotShaderDeep(
    {
      maxI: maxI,
      AA: AA,
    },
    showCrosshair,
    standardCrosshair,
  );
  const miniFragShader = newSmoothMandelbrotShader(
    {
      maxI: maxI,
      AA: 2,
    },
    showCrosshair,
    miniCrosshair,
  );

  const u: MandelbrotMapsWebGLUniforms = {
    zoom: z,
    xy: xy,
    theta: theta,
    maxI: maxI,
    colour: Rgb255ColourToFloat(colour), // vec3(0.0,0.6,1.0)
    // screenScaleMultiplier: screenScaleMultiplier,
  };

  const [dragging, setDragging] = useState(false);

  const gtb = [
    AnimationStatus.SELECT_JULIA_POINT,
    AnimationStatus.ZOOM_M,
    AnimationStatus.ZOOM_J,
    AnimationStatus.ROTATE_M,
    AnimationStatus.ROTATE_J,
  ].includes(animationState)
    ? frozenTouchBind({
        domTarget: canvasRef,
        controls: controls,
        setDragging: setDragging,
        DPR: DPR,
        precision: precision,
      })
    : animationState === AnimationStatus.PLAY
    ? synchronisedZoomTouchBind({
        domTarget: canvasRef,
        controls: controls,
        setDragging: setDragging,
        DPR: DPR,
        align: align,
        precision: precision,
      })
    : genericTouchBind({
        domTarget: canvasRef,
        controls: controls,
        // gl: gl,
        setDragging: setDragging,
        DPR: DPR,
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
            ...style,
          }}
        >
          <FPSCard FPS={FPS} show={settings.showFPS} />
          <WebGLCanvasDeep
            id="mandelbrot-canvas"
            fragShader={fragShader}
            DPR={DPR}
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
            DPR={DPR}
            u={u}
            canvasRef={miniCanvasRef}
            // glRef={miniGl}
            show={settings.showMinimap}
            controls={controls}
          />
        </div>
      )}
    </SettingsContext.Consumer>
  );
}
