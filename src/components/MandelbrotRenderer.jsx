import React, { Fragment, useRef, useEffect, useCallback } from "react";
import _ from 'lodash';
import { Typography, Card } from "@material-ui/core";

import { addV, useGesture } from "react-use-gesture";
import { scale } from 'vec-la';

import { animated } from "react-spring";

import * as twgl from "twgl.js";

import { fullVertexShader, fullscreenVertexArray } from "../shaders/fullVertexShader";
import smoothMandelbrotShader from "../shaders/smoothMandelbrotShader";

export default function MandelbrotRenderer(props) {

  // variables to hold canvas and webgl information
  const requestRef = useRef(null);
  const gl = useRef(null);
  const bufferInfo = useRef(null);
  const programInfo = useRef(null);

  const canvasRef = useRef(null);

  // this multiplier subdivides the screen space into smaller increments
  // to allow for velocity calculations to not immediately decay, due to the
  // otherwise small scale that is being mapped to the screen.
  const screenScaleMultiplier = props.screenmult;

  // temporary bounds to prevent excessive panning
  // eslint-disable-next-line
  const radialBound = 1;
  const relativeRadialBound = radialBound;// / -screenScaleMultiplier;
  const bounds = {
    top:    relativeRadialBound,
    bottom: relativeRadialBound,
    left:   relativeRadialBound,
    right:  relativeRadialBound,
  };


  // read incoming props
  const [{ pos, realPos }, setControlPos] = props.controls.pos;
  const [{ theta, last_pointer_angle }, setControlRot] = props.controls.rot;
  const [{ zoom, last_pointer_dist, minZoom, maxZoom }, setControlZoom] = props.controls.zoom;
  const maxI = props.maxiter;

  // the hook responsible for handling gestures
  const touchBind = useGesture({

    // prevent some browser events such as swipe-based navigation or
    // pinch-based zoom and instead redirect them to this handler
    onDragStart:  ({ event }) => event.preventDefault(),
    onPinchStart: ({ event }) => event.preventDefault(),

    onPinch: ({ offset: [d, a], down, vdva: [vd, va], last, memo = [theta.getValue(), last_pointer_angle.getValue(), zoom.getValue(), last_pointer_dist.getValue()] }) => {
      // alert(mx, my)
      // let [theta, lpa] = memo
      let [t, lpa, z, lpd] = memo;
      console.log(d);
      let d_rel = d / 250;
      let curr_zoom = zoom.getValue();

      setControlZoom({
        zoom: _.clamp(z + (d_rel - lpd) * Math.sign(curr_zoom) * Math.abs(curr_zoom ** 0.9), minZoom.getValue(), maxZoom.getValue()),
        last_pointer_dist: d_rel,

        immediate: down,
        // config: { velocity: vd, decay: true }
      });

      setControlRot({
        theta: t + (a - lpa),
        last_pointer_angle: a,

        immediate: down,
        // config: { velocity: va, decay: true }
      });

      return memo;
    },

    onPinchEnd: ({ vdva: [vd, va] }) => {
      setControlRot({
        // set theta so it's remembered next time
        theta: va,

        config: { velocity: va, decay: true }
      });
    },

    onDrag: ({ down, movement, velocity, direction, memo = pos.getValue() }) => {

      // change according to this formula:
      // move (x, y) in the opposite direction of drag (pan with cursor)
      // divide by canvas size to scale appropriately
      // multiply by 2 to correct scaling on viewport
      // use screen multiplier for more granularity
      let realZoom = gl.current.canvas.height * zoom.getValue() * screenScaleMultiplier;
      
      let plotMovement = scale(movement, 2/realZoom);

      let relMove = [plotMovement[0], -plotMovement[1]];
      let relDir  = [direction[0], -direction[1]];

      setControlPos({
        pos: addV(memo, relMove),                    // add the displacement to the starting position
        immediate: down,                                  // immediately apply if the gesture is active
        config: { 
          velocity: scale(relDir, velocity/realZoom),  // set the velocity (gesture momentum)
          decay: true,
        },
      });

      return memo;
    },

  }, { 
    event: { passive: false, capture: false }, 
    domTarget: canvasRef,
    // The config object passed to useGesture has drag, wheel, scroll, pinch and move keys
    // for specific gesture options. See here for more details.
    // drag: {
    //   bounds,
    //   rubberband: true,
    // }
  });

  useEffect(touchBind, [touchBind]);  

  // the main render function for WebGL
  const render = useCallback(time => {
    twgl.resizeCanvasToDisplaySize(gl.current.canvas);
    gl.current.viewport(0, 0, gl.current.canvas.width, gl.current.canvas.height);

    // values to pass to the shader
    const uniforms = {
      resolution: [gl.current.canvas.width, gl.current.canvas.height],
      u_zoom: zoom.getValue(),
      u_pos:  scale(pos.getValue(), -screenScaleMultiplier),  // re-scale from screen coordinates to plot coordinates
      u_maxI: maxI,
    };

    gl.current.useProgram(programInfo.current.program);
    twgl.setBuffersAndAttributes(gl.current, programInfo.current, bufferInfo.current);
    twgl.setUniforms(programInfo.current, uniforms);
    twgl.drawBufferInfo(gl.current, bufferInfo.current);
    // The 'state' will always be the initial value here
    requestRef.current = requestAnimationFrame(render);
  }, [maxI, pos, screenScaleMultiplier, zoom]);
  
  useEffect(() => {
    gl.current = canvasRef.current.getContext('webgl');
    console.log(`got canvas context: ${gl.current}`);
    // var glc = gl.current;
    // var prec = glc.getShaderPrecisionFormat(glc.FRAGMENT_SHADER, glc.HIGH_FLOAT);
//     alert(`\
// precision = ${prec.precision},
// rangeMin = ${prec.rangeMin},
// rangeMax = ${prec.rangeMax} 
//     `);

    // TODO : figure out shader sources!
    programInfo.current = twgl.createProgramInfo(gl.current, [fullVertexShader, smoothMandelbrotShader]);

    bufferInfo.current = twgl.createBufferInfoFromArrays(gl.current, fullscreenVertexArray);

    requestRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(requestRef.current);
  }, [render]); // Make sure the effect runs only once


  return (

    <Fragment>
      <Card
        style={{
          width: "auto",
          position: "absolute",
          zIndex: 2,
          left: 0,
          bottom: 0,
          margin: 20,
          padding: 5,
        }}
        >
        <Typography align="right">
          <animated.span>{pos.interpolate((x, y) => (-x * screenScaleMultiplier).toFixed(7))}</animated.span> : x<br />
          <animated.span>{pos.interpolate((x, y) => (-y * screenScaleMultiplier).toFixed(7))}</animated.span> : y
        </Typography>
      </Card>
      <canvas
        id="mandelbrot"
        className="renderer"
        style={{
          // zIndex: 1,
          // transform: "rotateX(180deg)",
        }}
        ref={canvasRef}
      />
    </Fragment>
  )


}