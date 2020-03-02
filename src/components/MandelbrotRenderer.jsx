import React, { useRef, useEffect, useState } from "react";
import _ from 'lodash';

import { useGesture } from "react-use-gesture";
import { animated } from "react-spring";

import newSmoothMandelbrotShader from "../shaders/newSmoothMandelbrotShader";
import WebGLCanvas from "./WebGLCanvas";
import { genericTouchBind } from "./utils";
import { Card } from "@material-ui/core";

export default function MandelbrotRenderer(props) {

  // variables to hold canvas and webgl information
  const canvasRef = useRef(null);
  const miniCanvasRef = useRef(null);
  
  const gl = useRef(null);
  const miniGl = useRef(null);

  // this multiplier subdivides the screen space into smaller increments
  // to allow for velocity calculations to not immediately decay, due to the
  // otherwise small scale that is being mapped to the screen.
  const screenScaleMultiplier = props.screenmult;

  // temporary bounds to prevent excessive panning
  // eslint-disable-next-line
  const radialBound = 1;
  // const relativeRadialBound = radialBound;// / -screenScaleMultiplier;


  // read incoming props
  const [{ pos }] = props.controls.pos;
  // const [{ theta, last_pointer_angle }, setControlRot] = props.controls.rot;
  const [{ zoom }, setControlZoom] = props.controls.zoom;
  const maxI = props.maxiter;
  const AA = props.aa ? 2 : 1;

  const fragShader = newSmoothMandelbrotShader({
    maxI: maxI,
    AA: AA,
  }, {
    stroke: props.crosshair ? 2 : 0,
    radius: props.crosshair ? 100 : 0,
  });
  const miniFragShader = newSmoothMandelbrotShader({
    maxI: maxI,
    AA: 2, 
  }, {
    stroke: props.crosshair ? 1 : 0,
    radius: props.crosshair ? 30 : 0,
  });

  
  let gtb = genericTouchBind({
    domTarget: canvasRef,
    posControl: props.controls.pos,
    zoomControl: props.controls.zoom,
    screenScaleMultiplier: screenScaleMultiplier / props.dpr,
    gl: gl,
  });

  let touchBind = useGesture(
    gtb.binds,
    gtb.config
  );

  useEffect(touchBind, [touchBind]);  

  const [fps, setFps] = useState(0);

  return (
    <div className="renderer" style={{
      position: "relative"
    }}>
      {props.showFps ?
        <Card style={{ position: "absolute", top: 0, left: 0, padding: 4, margin: 4 }}>
          <animated.div style={{ fontFamily: "monospace"}}>
            {fps}
          </animated.div>
        </Card> :
        null
      }
      <WebGLCanvas 
        id="mandelbrot"
        fragShader={fragShader}
        dpr={props.dpr}
        touchBind={touchBind}
        u={{
          zoom: zoom,
          pos: pos,
          maxI: maxI,
          screenScaleMultiplier: screenScaleMultiplier,
        }}
        ref={canvasRef}
        glRef={gl}
        fps={setFps}
      />
      {props.enableMini ? 
      <animated.div style={{
        position: "absolute",
        zIndex: 2,
        margin: "0.5rem",
        left: 0,
        bottom: 0,
        height: props.miniSize[0],
        width: props.miniSize[0],
        borderRadius: props.miniSize[0],
        // border: "1px solid #000",
        boxShadow: "0px 2px 10px 1px rgba(0, 0, 0, 0.4)",
        overflow: "hidden",
        opacity: zoom.interpolate(z => _.clamp(z - 1, 0, 1)),
        display: zoom.interpolate(z => _.clamp(z - 1, 0, 1) === 0 ? "none" : "block"),
      }}
      onClick={() => setControlZoom({ zoom: 1 })}
      >
        <WebGLCanvas 
          id="mini-mandelbrot"
          fragShader={miniFragShader}
          dpr={props.dpr}
          u={{
            zoom: zoom,
            pos: pos,
            maxI: maxI,
            screenScaleMultiplier: screenScaleMultiplier,
          }}
          ref={miniCanvasRef}
          glRef={miniGl}
          
          mini={true}
        />
      </animated.div>
      : <div />
      }
    </div>
  )


}