import React, { useCallback, useEffect, useRef } from 'react';
import { animated } from 'react-spring';
import * as twgl from 'twgl.js';
import { WebGLCanvasProps } from '../../common/render';
import { fullscreenVertexArray, fullVertexShader } from '../../shaders/fullVertexShader';

// https://mariusschulz.com/blog/typing-destructured-object-parameters-in-typescript
// https://stackoverflow.com/a/50294843/9184658
const WebGLCanvas = React.forwardRef<
  HTMLCanvasElement,
  WebGLCanvasProps & { mini?: boolean }
>((props, refAny) => {
  // const { mini = false, ...rest } = props;
  // props:
  // id
  // fragShader
  // -- uniforms:
  //    u_zoom
  //    u_pos
  //    u_maxI
  // ref
  // glRef

  const canvasRef = refAny as React.MutableRefObject<HTMLCanvasElement>;

  const gl = useRef<WebGLRenderingContext | null>();
  const renderRequestRef = useRef<number>();
  const bufferInfo = useRef<twgl.BufferInfo>();
  const programInfo = useRef<twgl.ProgramInfo>();

  const u = props.u;
  const setFps = props.fps;

  // have a zoom callback
  const zoom = useCallback(() => (props.mini ? 1.0 : props.u.zoom.getValue()), [
    props.mini,
    props.u.zoom,
  ]);
  const currZoom = useRef(zoom());

  const dpr = props.useDPR ? window.devicePixelRatio : 1;

  // initial context-getter
  useEffect(() => {
    // console.log(gl);
    // console.log(gl.current);
    gl.current = canvasRef.current.getContext('webgl');
    console.log(`WebGL canvas context created`);
    // remove this context?
    // return () => gl.current.
  }, [canvasRef]);

  useEffect(() => {
    // console.log(`got canvas context: ${gl.current}`);
    bufferInfo.current = twgl.createBufferInfoFromArrays(
      gl.current as WebGLRenderingContext,
      fullscreenVertexArray,
    );
  }, [gl]);

  useEffect(() => {
    currZoom.current = props.u.zoom.getValue();
  }, [props.u]);

  // re-compile program if shader changes
  useEffect(() => {
    programInfo.current = twgl.createProgramInfo(gl.current as WebGLRenderingContext, [
      fullVertexShader,
      props.fragShader,
    ]);
  }, [gl, props.fragShader]);

  const then = useRef(0);
  const frames = useRef(0);
  const elapsedTime = useRef(0);
  // fps update interval
  const interval = 1000;
  // const mult = 1000 / interval;
  // the main render function for WebGL
  const render = useCallback(
    (time) => {
      twgl.resizeCanvasToDisplaySize(canvasRef.current, dpr);
      (gl.current as WebGLRenderingContext).viewport(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height,
      );

      const uniforms = {
        resolution: [canvasRef.current.width, canvasRef.current.height],
        u_zoom: zoom(),
        u_c: u.c === undefined ? 0 : u.c.getValue(),
        u_xy: u.xy.getValue(),
        u_maxI: u.maxI,
        u_theta: u.theta.getValue(),
      };

      (gl.current as WebGLRenderingContext).useProgram(
        (programInfo.current as twgl.ProgramInfo).program,
      );
      twgl.setBuffersAndAttributes(
        gl.current as WebGLRenderingContext,
        programInfo.current as twgl.ProgramInfo,
        bufferInfo.current as twgl.BufferInfo,
      );
      twgl.setUniforms(programInfo.current as twgl.ProgramInfo, uniforms);
      twgl.drawBufferInfo(
        gl.current as WebGLRenderingContext,
        bufferInfo.current as twgl.BufferInfo,
      );

      // calculate fps
      if (setFps !== undefined) {
        frames.current++;
        elapsedTime.current += time - then.current;
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
    },
    [gl, u, zoom, dpr, setFps, interval, canvasRef],
  );

  //
  useEffect(() => {
    renderRequestRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(renderRequestRef.current as number);
  }, [render]);

  return (
    <animated.canvas
      className="renderer"
      ref={refAny}
      style={{
        // cursor should show whether the viewer is being grabbed
        cursor: props.dragging ? 'grabbing' : 'grab',
        // adding style allows direct style override
        ...props.style,
      }}
    />
  );
});

WebGLCanvas.displayName = 'WebGLCanvas';

export default WebGLCanvas;
