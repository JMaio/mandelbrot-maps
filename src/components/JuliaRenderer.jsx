import React, { useRef, useEffect, useCallback, Fragment } from "react";
import { useGesture, addV } from "react-use-gesture";
import { scale } from "vec-la";
import * as twgl from "twgl.js";
import { Card, Typography } from "@material-ui/core";
import { animated } from "react-spring";
import { fullVertexShader, fullscreenVertexArray } from "../shaders/fullVertexShader";
import smoothJuliaShader from "../shaders/smoothJuliaShader";
import newSmoothJuliaShader from "../shaders/newSmoothJuliaShader";
import _ from "lodash";
import WebGLCanvas from "./WebGLCanvas";


export default function JuliaRenderer(props) {

  // variables to hold canvas and webgl information
  const gl = useRef(null);

  const canvasRef = useRef(null);

  // this multiplier subdivides the screen space into smaller increments
  // to allow for velocity calculations to not immediately decay, due to the
  // otherwise small scale that is being mapped to the screen.
  const screenScaleMultiplier = props.screenmult;

  // read incoming props
  const [{ pos }, setControlPos] = props.controls.pos;
  const [{ theta, last_pointer_angle }, setControlRot] = props.controls.rot;
  const [{ zoom, last_pointer_dist, minZoom, maxZoom }, setControlZoom] = props.controls.zoom;
  const maxI = props.maxiter;

  const AA = 1;

  const fragShader = newSmoothJuliaShader(maxI, AA);

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

    onWheel: ({ event, movement: [mx, my], vxvy: [vx, vy] }) => {
      // x, y obtained from event
      let z = zoom.getValue();
      let newZ = z * (1 - my * (my < 0 ? 2e-3 : 9e-4));

      console.log(newZ, my, vy);
      // console.log(vy);

      setControlZoom({
        zoom: _.clamp(newZ, minZoom.getValue(), maxZoom.getValue()),
        config: {
          // bias velocity towards zooming in (vy negative )
          // if zooming
          velocity: _.clamp(vy * (vy < 0 ? 2.5 : 1.5), -10, 10), // * z**0.9 - my/15,
        }
      });
    },
    
    onDrag: ({ down, movement, velocity, direction, memo = pos.getValue() }) => {

      // change according to this formula:
      // move (x, y) in the opposite direction of drag (pan with cursor)
      // divide by canvas size to scale appropriately
      // multiply by 2 to correct scaling on viewport
      // use screen multiplier for more granularity
      let realZoom = gl.current.canvas.height * zoom.getValue() * screenScaleMultiplier;
      
      let plotMovement = scale(movement, -2/realZoom);

      let relMove = [plotMovement[0], -plotMovement[1]];
      let relDir  = [direction[0], -direction[1]];

      setControlPos({
        pos: addV(memo, relMove),                    // add the displacement to the starting position
        immediate: down,                                  // immediately apply if the gesture is active
        config: { 
          velocity: scale(relDir, -velocity/realZoom),  // set the velocity (gesture momentum)
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
  
  return (
    <WebGLCanvas
        id="julia"
        fragShader={fragShader}
        u={{
          zoom: zoom,
          pos: pos,
          c: props.c,
          maxI: maxI,
          screenScaleMultiplier: screenScaleMultiplier,
        }}
        ref={canvasRef}
        glRef={gl}
      />
  )
}