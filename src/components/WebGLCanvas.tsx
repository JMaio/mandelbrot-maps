// @ts-nocheck
import React, { useCallback, useEffect, useRef } from 'react';
import { animated } from 'react-spring';
import * as twgl from 'twgl.js';
import { vScale } from 'vec-la-fp';
import { WebGLUniforms } from '../common/types';
import { fullscreenVertexArray, fullVertexShader } from '../shaders/fullVertexShader';

/**
 * Props for the WebGLCanvas component
 *
 * @param mini - Controls whether this component should display as a minimap
 * @param glRef - The reference to the canvas to be used with a WebGL context
 * @param u - Uniforms to be passed down to the WebGL context
 *
 */
export interface WebGLCanvasProps {
  mini: boolean;

  glRef: React.MutableRefObject<HTMLCanvasElement>;
  u: WebGLUniforms;
  fps: any;
  // children?: ReactNode;
}

// https://mariusschulz.com/blog/typing-destructured-object-parameters-in-typescript
// https://stackoverflow.com/a/50294843/9184658
const WebGLCanvas = React.forwardRef<HTMLCanvasElement, WebGLCanvasProps>(
  (props, ref) => {
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

    // variables to hold canvas and webgl information
    const gl = props.glRef;
    const renderRequestRef = useRef(null);
    const bufferInfo = useRef(null);
    const programInfo = useRef(null);

    const u = props.u;
    const setFps = props.fps;

    // have a zoom callback
    const zoom = props.mini ? () => 1.0 : () => props.u.zoom.getValue();
    const currZoom = useRef(zoom);

    const dpr = window.devicePixelRatio || 1;

    useEffect(() => {
      currZoom.current = props.u.zoom.getValue();
    }, [props.u]);

    // initial context-getter
    useEffect(() => {
      gl.current = ref.current.getContext('webgl');
      // console.log(`got canvas context: ${gl.current}`);
      bufferInfo.current = twgl.createBufferInfoFromArrays(
        gl.current,
        fullscreenVertexArray,
      );
    }, [gl, ref]);

    const then = useRef(0);
    const frames = useRef(0);
    const elapsedTime = useRef(0);
    const interval = 1000;
    // let mult = 1000 / interval;
    // the main render function for WebGL
    const render = useCallback(
      (time) => {
        twgl.resizeCanvasToDisplaySize(gl.current.canvas, dpr);
        gl.current.viewport(0, 0, gl.current.canvas.width, gl.current.canvas.height);

        const uniforms = {
          resolution: [gl.current.canvas.width, gl.current.canvas.height],
          u_zoom: zoom(),
          u_c:
            u.c === undefined
              ? 0
              : u.c.getValue().map((x) => x * u.screenScaleMultiplier),
          u_xy: vScale(u.screenScaleMultiplier, u.xy.getValue()),
          u_maxI: u.maxI,
        };

        gl.current.useProgram(programInfo.current.program);
        twgl.setBuffersAndAttributes(gl.current, programInfo.current, bufferInfo.current);
        twgl.setUniforms(programInfo.current, uniforms);
        twgl.drawBufferInfo(gl.current, bufferInfo.current);

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
      [gl, u, zoom, dpr, setFps, interval],
    );

    // re-compile program if shader changes
    useEffect(() => {
      programInfo.current = twgl.createProgramInfo(gl.current, [
        fullVertexShader,
        props.fragShader,
      ]);
    }, [gl, props.fragShader]);

    //
    useEffect(() => {
      renderRequestRef.current = requestAnimationFrame(render);
      return () => cancelAnimationFrame(renderRequestRef.current);
    }, [render]);

    return <animated.canvas id={props.id} className="renderer" ref={ref} />;
  },
);

WebGLCanvas.displayName = 'WebGLCanvas';

export default WebGLCanvas;
