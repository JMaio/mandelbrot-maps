import React, { useRef, useEffect } from "react";
import _ from 'lodash';

import { useGesture } from "react-use-gesture";
import { animated } from "react-spring";

import newSmoothMandelbrotShader from "../shaders/newSmoothMandelbrotShader";
import WebGLCanvas from "./WebGLCanvas";
import { genericTouchBind } from "./utils";

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
  
  useEffect(() => {
    console.log(props.dpr);
  }, [props.dpr]);

  const fragShader = newSmoothMandelbrotShader({
    maxI: maxI,
    AA: AA,
  });
  const miniFragShader = newSmoothMandelbrotShader({
    maxI: maxI,
    AA: 2, 
    }, {
    stroke: 1, 
    radius: 30,
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


  return (
    <div className="renderer" style={{
      position: "relative"
    }}>
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