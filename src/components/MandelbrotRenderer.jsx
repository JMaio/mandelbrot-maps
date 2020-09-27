import { Card } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { animated } from 'react-spring';
import { useGesture } from 'react-use-gesture';
import newSmoothMandelbrotShader from '../shaders/newSmoothMandelbrotShader';
import ToggleableFade from '../theme/ToggleableFade';
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
  const maxI = props.maxiter; // -> global
  const AA = props.aa ? 2 : 1; // -> global

  const fragShader = newSmoothMandelbrotShader(
    {
      maxI: maxI,
      AA: AA,
    },
    {
      stroke: props.crosshair ? 2 : 0,
      radius: props.crosshair ? 100 : 0,
    },
  );
  const miniFragShader = newSmoothMandelbrotShader(
    {
      maxI: maxI,
      AA: 2,
    },
    {
      stroke: props.crosshair ? 1 : 0,
      radius: props.crosshair ? 30 : 0,
    },
  );

  const [dragging, setDragging] = useState(false);

  let gtb = genericTouchBind({
    domTarget: canvasRef,
    posControl: props.controls.xyCtrl,
    zoomControl: props.controls.zoomCtrl,
    screenScaleMultiplier: screenScaleMultiplier / props.dpr, // -> global
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
          <Card
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
          </Card>
          <WebGLCanvas
            id="mandelbrot"
            fragShader={fragShader}
            dpr={props.dpr}
            touchBind={touchBind}
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

          <ToggleableFade show={settings.minimap}>
            <MinimapViewer
              fragShader={miniFragShader}
              dpr={props.dpr}
              u={{
                zoom: zoom,
                xy: xy,
                maxI: maxI,
                screenScaleMultiplier: screenScaleMultiplier,
              }}
              canvasRef={miniCanvasRef}
              glRef={miniGl}
              onClick={() => setControlZoom({ zoom: 1 })}
            />
            {/* <animated.div
              style={{
                position: 'absolute',
                zIndex: 2,
                margin: '0.5rem',
                left: 0,
                bottom: 0,
                cursor: 'pointer',
                height: props.miniSize[0],
                width: props.miniSize[0],
                borderRadius: props.miniSize[0],
                // border: "1px solid #000",
                boxShadow: '0px 2px 10px 1px rgba(0, 0, 0, 0.4)',
                overflow: 'hidden',
                opacity: zoom.interpolate((z) => _.clamp(z - 1, 0, 1)),
                display: zoom.interpolate((z) =>
                  _.clamp(z - 1, 0, 1) === 0 ? 'none' : 'block',
                ),
              }}
              onClick={() => setControlZoom({ zoom: 1 })}
            > */}
            {/* <WebGLCanvas
                id="mini-mandelbrot"
                fragShader={miniFragShader}
                dpr={props.dpr}
                u={{
                  zoom: zoom,
                  xy: xy,
                  maxI: maxI,
                  screenScaleMultiplier: screenScaleMultiplier,
                }}
                ref={miniCanvasRef}
                glRef={miniGl}
                mini={true}
              /> */}
            {/* </animated.div> */}
          </ToggleableFade>
        </div>
      )}
    </SettingsContext.Consumer>
  );
}
