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

  // have a zoom callback
  const zoom = mini ? () => 1.0 : () => props.u.zoom.getValue();
  const currZoom = useRef(zoom);

  useEffect(() => {
    currZoom.current = props.u.zoom.getValue();
  }, [props.u]);

  // initial context-getter
  useEffect(() => {
    gl.current = ref.current.getContext('webgl');
    // console.log(`got canvas context: ${gl.current}`);
    bufferInfo.current = twgl.createBufferInfoFromArrays(gl.current, fullscreenVertexArray);
  }, [gl, ref]);

  // the main render function for WebGL
  const render = useCallback(time => {
    twgl.resizeCanvasToDisplaySize(gl.current.canvas);
    gl.current.viewport(0, 0, gl.current.canvas.width, gl.current.canvas.height);

    const uniforms = {
      resolution: [gl.current.canvas.width, gl.current.canvas.height],
      u_zoom: zoom(),
      u_c:    props.u.c === undefined ? 0 : props.u.c.getValue().map(x => x * props.u.screenScaleMultiplier),
      u_pos:  scale(props.u.pos.getValue(), props.u.screenScaleMultiplier),
      u_maxI: props.u.maxI,
    };

    gl.current.useProgram(programInfo.current.program);
    twgl.setBuffersAndAttributes(gl.current, programInfo.current, bufferInfo.current);
    twgl.setUniforms(programInfo.current, uniforms);
    twgl.drawBufferInfo(gl.current, bufferInfo.current);
    // The 'state' will always be the initial value here
    renderRequestRef.current = requestAnimationFrame(render);
  }, [gl, props.u, zoom]);

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