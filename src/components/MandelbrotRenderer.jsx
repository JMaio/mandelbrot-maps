import React, { Fragment, useRef, useEffect, useState } from "react";
import _ from 'lodash';
import { Typography, Button, Card } from "@material-ui/core";

import { addV, useGesture } from "react-use-gesture";
import { scale } from 'vec-la';

import { animated } from "react-spring";


export default function MandelbrotRenderer(props) {

  const touchTarget = useRef(null);
  const canvasRef = useRef(null);
  const [globalCtx, setGlobalCtx] = useState(null);
  // canvas size must be calculated dynamically
  const canvasSize = 400;
  const zoomFactor = 1;
  // 300px per axis unit
  const resolution = 300;

  // const bounds = { x: [-1.5, 0.5], y: [-1, 1] };
  const maxI = props.maxiter;

  const [{ pos }, setControlPos] = props.pos;
  const [{ theta, last_pointer_angle }, setControlRot] = props.rot;
  const [{ zoom, last_pointer_dist, minZoom, maxZoom }, setControlZoom] = props.zoom;

  var [lastRenderTime, setLastRenderTime] = useState(0);

  function linspace(start, stop, cardinality) {
    let step = (stop - start) / cardinality;
    return _.range(start, stop, step);
  }

  const clearCanvas = ctx => {
    let c = canvasRef.current;
    ctx.clearRect(0, 0, c.width, c.height)
  }

  const iterToGray = i => (
    // map 0 to 0, maxI to 255
    100 - Math.round(100 * i / maxI)
  );


  const fillProc = newCtx => {
    if (globalCtx == null) { return; }
    // default to global context
    let ctx = newCtx ? newCtx : globalCtx;
    let zRes = resolution * zoom.getValue();
    clearCanvas(ctx);
    // get center position in coordinate space from screen space
    let [xc, yc] = pos.getValue() //.map(a => (-a / zRes));
    console.log(`x: ${xc}, y: ${yc}`);

    // range dictated by resolution:
    const [z_range_x, z_range_y] = [canvasSize, canvasSize].map(s => s / (2 * zRes));
    console.log(`xmin: ${xc - z_range_x}, xmax: ${xc + z_range_x}`);
    // console.log(z_range_x)
    const [xl, xr] = [-1, 1].map(d => xc + d * z_range_x);
    const [yb, yt] = [-1, 1].map(d => yc + d * z_range_y);
    linspace(xl, xr, canvasSize).forEach((re, x) => {
      linspace(yb, yt, canvasSize).forEach((im, y) => {
        // let c = Complex(re, im);
        // var z = Complex.ZERO;
        // console.log(re, im);
        var draw = 0;
        var a = 0, b = 0;
        var a2 = 0, b2 = 0;
        for (let iter = 0; iter < maxI; iter++) {
          //  Re(c), Im(c) 
          [a, b] = [a2 - b2 + re, 2 * a * b + im];
          [a2, b2] = [a * a, b * b]
          // z = z.mul(z).add(c);
          draw = iter;
          if (a2 + b2 > 4.0) { break; }
        }
        // console.log()
        ctx.fillStyle = `hsl(0, 0%, ${iterToGray(draw)}%)`;
        // console.log(`drawing (${re}, ${im})`);
        ctx.fillRect(x, y, 1, 1);
      });
    });
    console.log("render complete!");
  };

  // const [{ newVd_test }, setNewVdDebug] = useSpring(() => ({
  //   newVd_test: 0,
  // }));

  // touch target bind for testing
  const touchBind = useGesture({

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
      // alert(`va = ${va}`)
      // let scaleVd = (
      //   vd/100 * (zoom.getValue() - minZoom.getValue()) * (maxZoom.getValue() - minZoom.getValue())
      // );
      // let limit = 2
      // let newZoom = _.clamp(zoom.getValue() + vd, minZoom.getValue(), maxZoom.getValue());
      // let newVd = vd * (newZoom - 50); //_.clamp(vd/100, -limit, limit)
      // let vd_norm = scale;
      // setNewVdDebug({
      //   newVd_test: newVd
      // })
      // setControlZoom({
      //   zoom: newZoom, 
      //   // new velocity relative to proximity to min/max values
      //   config: { velocity: newVd, decay: true }
      // })
      setControlRot({
        // set theta so it's remembered next time
        theta: va,

        config: { velocity: va, decay: true }
      });
    },


    onDragStart: ({ event }) => event.preventDefault(),
    onDrag: ({ down, movement, velocity, direction, memo = pos.getValue() }) => {

      // change according to this formula:
      // move (x, y) in the opposite direction of drag (pan with cursor)
      // divide by canvas size to scale appropriately
      // multiply by 2 to correct scaling on viewport
      //                                    current img size
      // const [dx, dy] = [mx, my].map(a => - a);

      // let [x, y, dx, dy, theta, zoom] = testTouchGrid;
      let realZoom = resolution * zoom.getValue();
      let plotMovement = movement.map(m => -m / realZoom);

      setControlPos({
        pos: addV(plotMovement, memo),
        immediate: down,
        config: { velocity: scale(direction, -velocity / realZoom), decay: true }
      });
      return memo;
    },

    onDragEnd: () => {
      fillProc(globalCtx);
      // setControlPos({
      //   pos: addV(movement, memo), 
      //   config: { velocity: scale(direction, velocity), decay: true }
      // })
    },

    // re-render when all animations come to a stand-still


  }, { event: { passive: false, capture: false }, domTarget: touchTarget });

  useEffect(touchBind, [touchBind]);


  useEffect(() => {
    const startCtx = canvasRef.current.getContext('2d');
    console.log(`got canvas context: ${startCtx}`);
    setGlobalCtx(startCtx); // globalCtx
    // return () => fillProc(globalCtx);
  }, []);

  useEffect(() => {
    fillProc(globalCtx);
  }, [globalCtx])

  // useEffect(() => {
  //   // console.log(pos.getValue(), zoom.getValue());
  //   fillProc(globalCtx);
  // }, [fillProc, globalCtx, maxI]);

  // const [ptime, setPtime] = useState(0);
  // const [ptime2, setPtime2] = useState(0);
  // const [ptime3, setPtime3] = useState(0);

  // useEffect(() => {
  //   // console.log("canvas loaded");
  //   const ctx = canvas.current.getContext("2d");
  //   setCtx(ctx);

  //   // if(!down) {
  //   //   clearCanvas(ctx)
  //   //   fillProc(ctx)
  //   // }
  //   // canvas.current.ready(() => {
  //   // fillProcFast(ctx);
  // }, [])


  return (
    <Fragment>

      <div
        // className="fullSize"
        style={{
          position: "absolute",
          //   width: "100%",
          //   height: "100%"
          zIndex: 1,
        }}
        // {...props}
        ref={touchTarget}
      >
        <animated.canvas
          id="mandelbrot"
          // className="fullSize"
          // width={window.innerWidth}
          // height={window.innerHeight}
          width={canvasSize}
          height={canvasSize}
          rotation={theta.interpolate(t => `${t}`)}
          // alt={pos.interpolate((x, y) => x)}
          style={{
            width: canvasSize * zoomFactor,
            height: canvasSize * zoomFactor,
            // transform: theta.interpolate(t =>
            //   `rotate(${t}deg)`
            //   // ((360 + theta.value + dt) % 360)
            //   // .toFixed(1)
            // ),
            // transform: interpolate([pos], ([x, y]) =>
            //   `matrix3d(
            //     1, 0, 0, 0,
            //     0, 1, 0, 0,
            //     0, 0, 1, 0,
            //     0, 0, 0, 1
            //   )`
            // ),
          }}
          ref={canvasRef}
        // onMouseUp={() => fillProc(ctx)}
        />
        <animated.div
          style={{
            display: "none",
            width: 20,
            height: 20,
            backgroundColor: "red",
            position: "absolute",
            top: 300 - 10,
            left: 300 - 10,
            transform: pos.interpolate((x, y) =>
              `translate(${-x * resolution * zoom.getValue()}px, ${-y * resolution * zoom.getValue()}px)`
            ),
          }}
        />
      </div>

      <div style={{
        position: "absolute",
        bottom: 0,
      }}>
        <Card>
          <Typography
            style={{
              zIndex: 1
            }}>
            theta: <animated.span>{theta.interpolate(t => t.toFixed(3))}</animated.span>,
            zoom: <animated.span>{zoom.interpolate(z => z.toFixed(3))}</animated.span>,
            {/* x: <animated.span>{grid.dx.interpolate(d => (grid.x.value + d).toFixed(3))}</animated.span>, 
            y: <animated.span>{grid.dy.interpolate(d => (grid.y.value + d).toFixed(3))}</animated.span> */}
          </Typography>
        </Card>
        <Button variant="contained" color="primary" 
        onClick={e => {
          let t0 = performance.now();
          fillProc();
          let t1 = performance.now()
          let t = t1 - t0;
          console.log(`rendered in ${t}`);
          setLastRenderTime(t);
          // setPtime(t1 - t0);
        }}>render</Button>
        <Typography>render time: { lastRenderTime.toFixed(4) }</Typography>

      </div>


    </Fragment>
  )


}