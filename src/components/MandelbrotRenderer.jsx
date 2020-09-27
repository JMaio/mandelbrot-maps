import React, { useEffect, useRef, useState } from 'react';
import { useGesture } from 'react-use-gesture';
import newSmoothMandelbrotShader, {
  miniCrosshair,
  standardCrosshair,
} from '../shaders/newSmoothMandelbrotShader';
import ToggleableFade from '../theme/ToggleableFade';
import FPSCard from './info/FPSCard';
import MinimapViewer from './render/MinimapViewer';
import { SettingsContext } from './SettingsWrapper';
import { genericTouchBind } from './utils';
import WebGLCanvas from './WebGLCanvas';

export default function MandelbrotRenderer(props) {
  // variables to hold canvas and webgl information
  const canvasRef = useRef();
  const miniCanvasRef = useRef();

  const gl = useRef();
  const miniGl = useRef();

  // this multiplier subdivides the screen space into smaller increments
  // to allow for velocity calculations to not immediately decay, due to the
  // otherwise small scale that is being mapped to the screen.
  const screenScaleMultiplier = props.screenmult; // -> global

  // temporary bounds to prevent excessive panning
  // eslint-disable-next-line
  const radialBound = 1;
  // const relativeRadialBound = radialBound;// / -screenScaleMultiplier;

  // read incoming props
  const [{ xy }] = props.controls.xyCtrl;
  // const [{ theta, last_pointer_angle }, setControlRot] = props.controls.rot;
  const [{ zoom }, setControlZoom] = props.controls.zoomCtrl;
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

  const [dragging, setDragging] = useState(false);

  let gtb = genericTouchBind({
    domTarget: canvasRef,
    posControl: props.controls.xyCtrl,
    zoomControl: props.controls.zoomCtrl,
    screenScaleMultiplier:
      screenScaleMultiplier / (props.useDPR ? window.devicePixelRatio : 1), // -> global
    gl: gl,
    setDragging: setDragging,
  });

  let touchBind = useGesture(gtb.binds, gtb.config);

  useEffect(touchBind, [touchBind]);

  const [fps, setFps] = useState(0);

  return (
    <SettingsContext.Consumer>
      {({ settings }) => (
        <div
          className="renderer"
          style={{
            position: 'relative',
          }}
        >
          <FPSCard fps={fps} show={settings.showFPS} />
          {/* <Card
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              padding: 4,
              margin: 4,
              display: settings.showFPS ? 'block' : 'none',
            }}
          >
            <animated.div style={{ fontFamily: 'monospace' }}>{fps}</animated.div>
          </Card> */}
          <WebGLCanvas
            id="mandelbrot"
            fragShader={fragShader}
            useDPR={settings.useDPR}
            // touchBind={touchBind}
            u={{
              zoom: zoom,
              xy: xy,
              maxI: maxI,
              screenScaleMultiplier: screenScaleMultiplier,
            }}
            ref={canvasRef}
            glRef={gl}
            fps={setFps}
            dragging={dragging}
          />

          <ToggleableFade show={settings.showMinimap}>
            <MinimapViewer
              fragShader={miniFragShader}
              useDPR={settings.useDPR}
              u={{
                zoom: zoom,
                xy: xy,
                maxI: maxI,
                screenScaleMultiplier: screenScaleMultiplier,
              }}
              canvasRef={miniCanvasRef}
              glRef={miniGl}
              show={settings.showMinimap}
              onClick={() => setControlZoom({ zoom: 1 })}
            />
          </ToggleableFade>
        </div>
      )}
    </SettingsContext.Consumer>
  );
}
