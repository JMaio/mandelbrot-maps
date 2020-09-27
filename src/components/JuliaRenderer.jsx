import React, { useEffect, useRef, useState } from 'react';
import { useGesture } from 'react-use-gesture';
import newSmoothJuliaShader from '../shaders/newSmoothJuliaShader';
import MinimapViewer from './render/MinimapViewer';
import { SettingsContext } from './SettingsWrapper';
import { genericTouchBind } from './utils';
import WebGLCanvas from './WebGLCanvas';

export default function JuliaRenderer(props) {
  // variables to hold canvas and webgl information
  const canvasRef = useRef();
  const miniCanvasRef = useRef();

  const gl = useRef();
  const miniGl = useRef();

  // this multiplier subdivides the screen space into smaller increments
  // to allow for velocity calculations to not immediately decay, due to the
  // otherwise small scale that is being mapped to the screen.
  const screenScaleMultiplier = props.screenmult;

  // read incoming props
  const [{ xy }] = props.controls.xyCtrl;
  // const [{ theta, last_pointer_angle }, setControlRot] = props.controls.rot;
  const [{ zoom }, setControlZoom] = props.controls.zoomCtrl;
  const maxI = props.maxiter;
  const AA = props.aa ? 2 : 1;

  const fragShader = newSmoothJuliaShader({
    maxI: maxI,
    AA: AA,
    // showCrosshair: false,
  });

  const miniFragShader = newSmoothJuliaShader({
    maxI: maxI,
    AA: 2,
    // showCrosshair: false,
  });

  const [dragging, setDragging] = useState(false);

  let gtb = genericTouchBind({
    domTarget: canvasRef,
    posControl: props.controls.xyCtrl,
    zoomControl: props.controls.zoomCtrl,
    screenScaleMultiplier:
      screenScaleMultiplier / (props.useDPR ? window.devicePixelRatio : 1),
    gl: gl,
    setDragging: setDragging,
  });

  let touchBind = useGesture(gtb.binds, gtb.config);

  useEffect(touchBind, [touchBind]);

  return (
    <SettingsContext.Consumer>
      {({ settings }) => (
        <div
          className="renderer"
          style={{
            position: 'relative',
          }}
        >
          <WebGLCanvas
            id="julia"
            fragShader={fragShader}
            useDPR={props.useDPR}
            // touchBind={touchBind}
            u={{
              zoom: zoom,
              xy: xy,
              c: props.c,
              maxI: maxI,
              screenScaleMultiplier: screenScaleMultiplier,
            }}
            ref={canvasRef}
            glRef={gl}
            dragging={dragging}
          />
          <MinimapViewer
            fragShader={miniFragShader}
            useDPR={settings.useDPR}
            u={{
              zoom: zoom,
              xy: xy,
              maxI: maxI,
              c: props.c,
              screenScaleMultiplier: screenScaleMultiplier,
            }}
            canvasRef={miniCanvasRef}
            glRef={miniGl}
            onClick={() => setControlZoom({ zoom: 1 })}
            show={settings.showMinimap}
          />
        </div>
      )}
    </SettingsContext.Consumer>
  );
}
