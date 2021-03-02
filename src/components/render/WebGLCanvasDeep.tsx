import Double from 'double.js';
import React, { useCallback, useEffect, useRef } from 'react';
import { animated } from 'react-spring';
import * as twgl from 'twgl.js';
import { vScale } from 'vec-la-fp';
import { WebGLCanvasProps } from '../../common/render';
import { fullscreenVertexArray } from '../../shaders/fullVertexShader';
import { mandelbrotDeepVert } from '../../shaders/mandelbrotShaderDeep';

// https://mariusschulz.com/blog/typing-destructured-object-parameters-in-typescript
// https://stackoverflow.com/a/50294843/9184658
const WebGLCanvasDeep = React.forwardRef<HTMLCanvasElement, WebGLCanvasProps>(
  (
    { u, fragShader, setFPS, DPR, dragging, id, mini, ...props }: WebGLCanvasProps,
    refAny,
  ) => {
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

    const maxI = u.maxI;
    const squareRadius = 3e5;

    const canvasRef = refAny as React.MutableRefObject<HTMLCanvasElement>;

    const gl = useRef<WebGLRenderingContext>();
    const renderRequestRef = useRef<number>();
    const bufferInfo = useRef<twgl.BufferInfo>();
    const programInfo = useRef<twgl.ProgramInfo>();

    // const u = props.u;
    // const setFps = props.fps;

    // have a zoom callback
    // keeps minimaps at a fixed zoom level
    const zoom = useCallback(() => (mini ? 0.95 : u.zoom.getValue()), [mini, u.zoom]);

    // const DPR = props.useDPR ? props.DPR : 1;

    // canvas setup step - get webgl context
    const setupCanvas = useCallback(() => {
      gl.current = twgl.getWebGLContext(canvasRef.current, {
        antialias: false,
        depth: false,
      });
      console.debug(`WebGL canvas context created`);
    }, [gl, canvasRef]);

    useEffect(() => {
      setupCanvas();

      // https://www.khronos.org/webgl/wiki/HandlingContextLost
      canvasRef.current.addEventListener(
        'webglcontextlost',
        (event: Event) => {
          console.error('WebGL context lost!');
          event.preventDefault();
          // trigger an error alert in future?
        },
        false,
      );
      canvasRef.current.addEventListener(
        'webglcontextrestored',
        (event: Event) => {
          console.error('WebGL context restored! Setting up...');
          setupCanvas();
        },
        false,
      );

      // remove this context?
      // return () => gl.current ??
    }, [canvasRef, setupCanvas]);

    const compileShader = useCallback(() => {
      const ctx = gl.current as WebGLRenderingContext;
      bufferInfo.current = twgl.createBufferInfoFromArrays(ctx, fullscreenVertexArray);
      programInfo.current = twgl.createProgramInfo(ctx, [mandelbrotDeepVert, fragShader]);
      console.debug(`Fragment shader compiled`);
    }, [gl, fragShader]);

    // re-compile program if shader changes
    useEffect(compileShader, [compileShader]);

    const then = useRef(0);
    const frames = useRef(0);
    const elapsedTime = useRef(0);
    // fps update interval
    const interval = 1000;

    // interface calcOrbitIn {
    //   c: { x: Double; y: Double };
    //   c0?: { x: Double; y: Double };
    //   returnIteration?: boolean;
    // }
    /**
     * (From deep-fractal)
     * Calculating orbit for one point in Mandelbrot/Julia fractal.
     * For Mandelbrot c0=undefined, for julia set c0 it is initial c.
     * If you want only iteration count, you need to pass returnIteration = true
     */
    const calcOrbit = useCallback(
      (
        c: { x: Double; y: Double },
        c0?: { x: Double; y: Double },
        returnTexture = true,
      ): [orbit: number[], iterations: number] => {
        // this happens in double.js, with high precision
        let x = c0 ? c0.x : c.x,
          y = c0 ? c0.y : c.y;
        let xx = x.sqr(),
          yy = y.sqr(),
          xy = x.mul(y);
        let dx = Double.One,
          dy = Double.Zero;
        let temp: Double, i: number;

        // save the orbit params
        const orbit = [x.toNumber(), y.toNumber(), dx.toNumber(), dy.toNumber()];
        // normal iteration until maxI and within radius
        for (i = 1; i < maxI && xx.add(yy).lt(squareRadius); i++) {
          // dx = 2(x * dx - y * dy) + 1
          temp = x.mul(dx).sub(y.mul(dy)).mul(2).add(1);
          // dy = 2(x * dy + y * dx)
          dy = x.mul(dy).add(y.mul(dx)).mul(2);
          dx = temp;
          // x = x^2 - y^2 + c.x
          x = xx.sub(yy).add(c.x);
          // y = xy + xy + c.y
          y = xy.add(xy).add(c.y);

          xx = x.sqr();
          yy = y.sqr();
          xy = x.mul(y);
          // don't do extra computation if only the iteration count matters
          if (returnTexture) {
            orbit.push(x.toNumber());
            orbit.push(y.toNumber());
            orbit.push(dx.toNumber());
            orbit.push(dy.toNumber());
          }
        }
        // this becomes a "texture" as a way to pass data to webgl
        return [orbit, i];
      },
      [maxI],
    );

    interface deepfractalBaseAimType {
      x: Double;
      y: Double;
    }
    interface deepfractalAimType extends deepfractalBaseAimType {
      hx: Double;
      hy: Double;
      phi: number;
    }

    /**
     * Logarithmic search of new reference point.
     * aim: the object representing ~bounding box? or current view?~ current view!
     *   - x, y, width, height, angle
     * aim = { x: Double, y: Double, hx: Double, hy: Double, phi: number };
     */
    const searchOrigin = useCallback(
      (
        aim: deepfractalAimType,
        // julia: { x: Double; y: Double }
      ): deepfractalBaseAimType => {
        const defaultBaseAimType: deepfractalBaseAimType = {
          x: Double.Zero,
          y: Double.Zero,
        };
        const repeat = 15,
          n = 12,
          m = 3;
        const z = defaultBaseAimType;
        const zbest: deepfractalBaseAimType = { x: new Double(0), y: new Double(0) };
        const newAim = Object.assign({}, aim);

        let fbest = -Infinity;

        for (let k = 0; k < repeat; k++) {
          for (let i = 0; i <= n; i++) {
            for (let j = 0; j <= n; j++) {
              z.x = newAim.x.add(newAim.hx.mul((2 * i) / n - 1));
              z.y = newAim.y.add(newAim.hy.mul((2 * j) / n - 1));
              // f = julia ? calcOrbit(julia, z, true) : calcOrbit(z, null, true);
              // invert the "return iterations" logic
              // const [, f] = julia ? calcOrbit(julia, z) : calcOrbit(z, undefined);
              const [, f] = calcOrbit(z, undefined);
              if (f === maxI) {
                return z;
              } else if (f > fbest) {
                Object.assign(zbest, z);
                fbest = f;
              }
            }
          }
          Object.assign(newAim, zbest);
          newAim.hx = newAim.hx.div(m / n);
          newAim.hy = newAim.hy.div(m / n);
        }
        return zbest;
      },
      [calcOrbit, maxI],
    );

    // the main render function for WebGL
    const render = useCallback(
      (time) => {
        const ctx = gl.current as WebGLRenderingContext;
        const prog = programInfo.current as twgl.ProgramInfo;
        const buff = bufferInfo.current as twgl.BufferInfo;

        twgl.resizeCanvasToDisplaySize(canvasRef.current, DPR);
        // scale the viewport to the canvas size
        ctx.viewport(0, 0, ctx.canvas.width, ctx.canvas.height);

        const [x, y] = u.xy.getValue();
        // const ratio = ctx.canvas.width / ctx.canvas.height;

        // console.log(ratio);

        // "size", meaning the number of units from the centre to the edge of the canvas
        const size = vScale(
          // use the height as the dominant dimension
          1 / (zoom() * ctx.canvas.height),
          [ctx.canvas.width, ctx.canvas.height],
        );
        const [hx, hy] = size;

        // console.log('x, y:', [x, y]);
        // console.log('hx, hy:', size);

        // console.log(ratio);
        // deep-fractal
        // const julia = { x: Double.Zero, y: Double.Zero };
        // const origin = searchOrigin(aim, julia ? julia : 0);
        // const orbit = julia ? calcOrbit(julia, origin) : calcOrbit(origin);
        // const texsize = Math.ceil(Math.sqrt(orbit.length / 4));
        const aim: deepfractalAimType = {
          x: new Double(x),
          y: new Double(y),
          // looks like a way to get the screen size ratio?
          hx: new Double(hx),
          hy: new Double(hy),
          phi: u.theta,
        };

        const origin = searchOrigin(aim);
        // console.log(origin);
        const [orbit] = calcOrbit(origin);
        // console.debug(orbit);
        const texsize = Math.ceil(Math.sqrt(orbit.length / 4));

        // pass orbit data to webgl through a large array
        const orbittex = twgl.createTexture(ctx, {
          format: ctx.RGBA,
          type: ctx.FLOAT,
          minMag: ctx.NEAREST,
          wrap: ctx.CLAMP_TO_EDGE,
          src: orbit,
        });

        const center = [aim.x.sub(origin.x).toNumber(), aim.y.sub(origin.y).toNumber()];

        // console.log("'size':", size);
        // console.log('center:', center);

        const uniforms = {
          resolution: [ctx.canvas.width, ctx.canvas.height],
          u_zoom: zoom(),
          u_c: u.c === undefined ? 0 : u.c.getValue(),
          u_xy: [x, y],
          u_maxI: u.maxI,
          u_theta: u.theta.getValue(),
          u_colour: u.colour,

          orbittex: orbittex,
          texsize: texsize,
          size: size,
          // size of a pixel in fractal space?
          pixelsize: [hy, hy].map((i) => i / ctx.canvas.width),
          // perturbation centre point?
          // center: [aim.x.sub(origin.x).toNumber(), aim.y.sub(origin.y).toNumber()],
          center: center,
        };

        // console.log([hx, hx].map((i) => i / ctx.canvas.width));

        ctx.useProgram(prog.program);
        twgl.setBuffersAndAttributes(ctx, prog, buff);
        twgl.setUniforms(prog, uniforms);
        twgl.drawBufferInfo(ctx, buff);

        // calculate fps
        if (setFPS !== undefined) {
          frames.current++;
          elapsedTime.current += time - then.current;
          then.current = time;

          // console.log(elapsedTime.current);
          if (elapsedTime.current >= interval) {
            //multiply with (1000 / elapsed) for accuracy
            setFPS((frames.current * (interval / elapsedTime.current)).toFixed(1));
            frames.current = 0;
            elapsedTime.current -= interval;

            // document.getElementById('test').innerHTML = fps;
          }
        }

        // The 'state' will always be the initial value here
        renderRequestRef.current = requestAnimationFrame(render);
      },
      [gl, u, zoom, DPR, setFPS, interval, canvasRef, calcOrbit, searchOrigin],
    );

    useEffect(() => {
      renderRequestRef.current = requestAnimationFrame(render);
      return () => cancelAnimationFrame(renderRequestRef.current as number);
    }, [render]);

    return (
      <animated.canvas
        className="renderer"
        ref={refAny}
        id={id}
        style={{
          // cursor should show whether the viewer is being grabbed
          cursor: dragging ? 'grabbing' : 'grab',
          // adding style allows direct style override
          ...props.style,
        }}
      />
    );
  },
);

WebGLCanvasDeep.displayName = 'WebGLCanvas';

export default WebGLCanvasDeep;
