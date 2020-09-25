import _ from 'lodash';
import React, { useEffect, useRef } from 'react';
import { animated } from 'react-spring';
import { useGesture } from 'react-use-gesture';
import newSmoothJuliaShader from '../shaders/newSmoothJuliaShader';
import { genericTouchBind } from './utils';
import WebGLCanvas from './WebGLCanvas';

export default function JuliaRenderer(props) {
  // variables to hold canvas and webgl information
  const canvasRef = useRef(null);
  const miniCanvasRef = useRef(null);

  const gl = useRef(null);
  const miniGl = useRef(null);

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
  });

  const miniFragShader = newSmoothJuliaShader({
    maxI: maxI,
    AA: 2,
  });

  let gtb = genericTouchBind({
    domTarget: canvasRef,
    posControl: props.controls.xyCtrl,
    zoomControl: props.controls.zoomCtrl,
    screenScaleMultiplier: screenScaleMultiplier / props.dpr,
    gl: gl,
  });

  let touchBind = useGesture(gtb.binds, gtb.config);

  useEffect(touchBind, [touchBind]);

  return (
    <div
      className="renderer"
      style={{
        position: 'relative',
      }}
    >
      <WebGLCanvas
        id="julia"
        fragShader={fragShader}
        dpr={props.dpr}
        u={{
          zoom: zoom,
          xy: xy,
          c: props.c,
          maxI: maxI,
          screenScaleMultiplier: screenScaleMultiplier,
        }}
        ref={canvasRef}
        glRef={gl}
      />
      {/* mini viewer */}
      {props.enableMini ? (
        <animated.div
          style={{
            position: 'absolute',
            zIndex: 2,
            margin: 20,
            left: 0,
            bottom: 0,
            height: props.miniSize[0],
            width: props.miniSize[0],
            borderRadius: props.miniSize[0],
            // border: "1px solid #000",
            boxShadow: '0px 2px 10px 1px rgba(0, 0, 0, 0.4)',
            overflow: 'hidden',
            opacity: zoom.interpolate((z) => _.clamp(z - 1, 0, 1)),
            display: zoom.interpolate((z) => (_.clamp(z - 1, 0, 1) === 0 ? 'none' : 'block')),
          }}
          onClick={() => setControlZoom({ zoom: 1 })}
        >
          <WebGLCanvas
            id="mini-julia"
            fragShader={miniFragShader}
            dpr={props.dpr}
            u={{
              zoom: zoom,
              xy: xy,
              c: props.c,
              maxI: maxI,
              screenScaleMultiplier: screenScaleMultiplier,
            }}
            ref={miniCanvasRef}
            glRef={miniGl}
            mini={true}
          />
        </animated.div>
      ) : (
        <div />
      )}
    </div>
  );
}
