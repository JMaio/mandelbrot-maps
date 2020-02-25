import React, { useEffect, useCallback, useRef } from "react";
import * as twgl from "twgl.js";
import { fullVertexShader, fullscreenVertexArray } from "../shaders/fullVertexShader";
import { scale } from 'vec-la';
import { animated } from "react-spring";

export default React.forwardRef(({mini = false, ...props}, ref) => {
  // props:
  // id
  // fragShader
  // -- uniforms:
  //    u_zoom
  //    u_pos
  //    u_maxI
  // ref
  // glRef

  // variables to hold canvas and webgl information
  const gl               = props.glRef;
  const renderRequestRef = useRef(null);
  const bufferInfo       = useRef(null);
  const programInfo      = useRef(null);

  const u = props.u;
  const setFps = props.fps;

  // have a zoom callback
  const zoom = mini ? () => 1.0 : () => props.u.zoom.getValue();
  const currZoom = useRef(zoom);

  const dpr = props.dpr || 1;

  useEffect(() => {
    currZoom.current = props.u.zoom.getValue();
  }, [props.u]);

  // initial context-getter
  useEffect(() => {
    gl.current = ref.current.getContext('webgl');
    // console.log(`got canvas context: ${gl.current}`);
    bufferInfo.current = twgl.createBufferInfoFromArrays(gl.current, fullscreenVertexArray);
  }, [gl, ref]);

  
  let then = useRef(0);
  let frames = useRef(0);
  let elapsedTime = useRef(0);
  let interval = 1000;
  // let mult = 1000 / interval;
  // the main render function for WebGL
  const render = useCallback(time => {
    twgl.resizeCanvasToDisplaySize(gl.current.canvas, dpr);
    gl.current.viewport(0, 0, gl.current.canvas.width, gl.current.canvas.height);

    const uniforms = {
      resolution: [gl.current.canvas.width, gl.current.canvas.height],
      u_zoom: zoom(),
      u_c:    u.c === undefined ? 0 : u.c.getValue().map(x => x * u.screenScaleMultiplier),
      u_pos:  scale(u.pos.getValue(), u.screenScaleMultiplier),
      u_maxI: u.maxI,
    };

    gl.current.useProgram(programInfo.current.program);
    twgl.setBuffersAndAttributes(gl.current, programInfo.current, bufferInfo.current);
    twgl.setUniforms(programInfo.current, uniforms);
    twgl.drawBufferInfo(gl.current, bufferInfo.current);

    // calculate fps
    if (setFps !== undefined) {
      frames.current++;
      elapsedTime.current += (time - then.current);
      then.current = time;
      
      // console.log(elapsedTime.current);
      if (elapsedTime.current >= interval) {
          //multiply with (1000 / elapsed) for accuracy
          setFps((frames.current * (interval / elapsedTime.current)).toFixed(1));
          frames.current = 0;
          elapsedTime.current -= interval;

          // document.getElementById('test').innerHTML = fps;
      }
      // time *= 0.001;                      // convert to seconds
      // const deltaTime = time - then.current; // compute time since last frame
      // then.current = time;                // remember time for next frame
      // const fs = 1 / deltaTime;           // compute frames per second
      // console.log(fs);
      // (fs.toFixed(1));  // update fps display
    }

    // The 'state' will always be the initial value here
    renderRequestRef.current = requestAnimationFrame(render);
    
  }, [gl, u, zoom, dpr, setFps]);

  // re-compile program if shader changes
  useEffect(() => {
    programInfo.current = twgl.createProgramInfo(gl.current, [fullVertexShader, props.fragShader]);
  }, [gl, props.fragShader]);

  // 
  useEffect(() => {
    renderRequestRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(renderRequestRef.current);
  }, [render]);

  return (
    <animated.canvas
      id={props.id}
      className="renderer"
      ref={ref} />
  );
});