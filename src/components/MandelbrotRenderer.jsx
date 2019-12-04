import React, { useRef, useEffect, useState } from "react";
import Complex from 'complex.js';
import _ from 'lodash';
import { Typography, Button, Slider, Card } from "@material-ui/core";

import { useDrag, addV, subV, useGesture } from "react-use-gesture";
import { add, scale, dist } from 'vec-la'

import { useSpring, animated, interpolate, config } from "react-spring";


export default function MandelbrotRenderer(props) {

  const touchTarget = useRef(null);
  const canvas = useRef(null);
  const canvasSize = 200;
  const zoomFactor = 3;

  const bounds = {x: [-1.5, 0.5], y: [-1, 1]};
  const [maxI, setMaxI] = useState(23);


  // {x, y, dx, dy, theta, zoom}
  const [grid, setGrid] = useSpring(() => ({
    x: 0, 
    y: 0, 

    dx: 0,
    dy: 0,

    theta: 0,

    zoom: 100,

  }));

  function linspace(start, stop, cardinality) {
    let step = (stop - start) / cardinality;
    return _.range(start, stop, step);
  }

  // const clearCanvas = ctx => {
  //   let c = canvas.current;
  //   ctx.clearRect(0, 0, c.width, c.height)
  // }

  // const fillDiag = ctx => {
  //   ctx.fillStyle = "#444";

  //   for (let i = 0; i < canvasSize; i++) {
  //     console.log("square: " + i);
  //     ctx.fillRect(i, i, 1, 1);
  //   }
  // }

  // const fillProcFast = ctx => {
  //   let {x, y, zoom} = grid;
  //   const [xl, xr] = [x.value-1, x.value+1];
  //   const [yb, yt] = [y.value-1, y.value+1];

  //   clearCanvas(ctx);
  //   console.log(canvasSize / 2);
  //   console.log(zoom);
  //   console.log(yb);
  //   // let l = linspace(yt, 0, canvasSize / 2)
  //   // l.push(0);
  //   // console.log(l);
  //   ctx.fillStyle = "#444";

  //   const lsRe = linspace(xl, xr, canvasSize);
  //   const lsIm = linspace(yt, 0, canvasSize / 2);
  //   lsIm.push(0);

  //   lsRe.forEach((re, x) => {
  //     // let l = 
  //     // l.push(0);
  //     lsIm.forEach((im, y) => {
  //       // y > 180 && console.log(y);
  //       let c = Complex(re, im);
  //       var z = Complex.ZERO;
  //       var draw = true;
  //       // console.log(z.toString());
  //       for (let iter = 0; iter < maxI; iter++) {
  //         z = z.mul(z).add(c);
  //         if (z.abs() > 2) { draw = false; break; }
  //       }
  //       if (draw) {
  //         ctx.fillRect(x, y, 1, 1);
  //         if (y < canvasSize) {
  //           ctx.fillRect(x, (canvasSize - y), 1, 1);
  //         }
  //       }
  //     });
  //   });
  // };


  // const fillProc = ctx => {
  //   let {x, y, dx, dy} = grid;
  //   const [xs, ys] = [x.value + dx.value, y.value + dy.value]
  //   const [xl, xr] = [xs-1, xs+1];
  //   const [yb, yt] = [ys-1, ys+1];
  //   linspace(xl, xr, canvasSize).forEach((re, x) => {
  //     linspace(yb, yt, canvasSize).forEach((im, y) => {
  //       let c = Complex(re, im);
  //       var z = Complex.ZERO;
  //       var draw = true;
  //       // console.log(z.toString());
  //       for (let iter = 0; iter < maxI; iter++) {
  //         z = z.mul(z).add(c);
  //         if (z.abs() > 2.0) { draw = false; break; }
  //       }
  //       ctx.fillStyle = draw ? "#000" : "#fff";
  //       ctx.fillRect(x, y, 1, 1);
  //     });
  //   });
  // };

  const fillProcAsync = ctx => {
    console.log("entered fillproc");
    return new Promise(resolve => {
      const [xl, xr] = bounds.x;
      const [yb, yt] = bounds.y;
      ctx.fillStyle = "#ddd";
      linspace(xl, xr, canvasSize).forEach((re, x) => {
        linspace(yb, yt, canvasSize).forEach((im, y) => {
          let c = Complex(re, im);
          var z = Complex.ZERO;
          var draw = true;
          // console.log(z.toString());
          for (let iter = 0; iter < maxI; iter++) {
            z = z.mul(z).add(c);
            if (z.abs() > 2.0) { draw = false; break; }
          }
          if (draw) {
            ctx.fillRect(x, y, 1, 1);
          }
        });
      });
      resolve();
    })
  };


  const [{ pos }, setControlPos] = props.pos;

  const [{ theta, last_pointer_angle }, setControlRot] = props.rot;

  const [{ zoom, last_pointer_dist, minZoom, maxZoom }, setControlZoom] = props.zoom;

  const [{ newVd_test }, setNewVdDebug] = useSpring(() => ({
    newVd_test: 0,
  }))
  // touch target bind for testing
  const touchBind = useGesture({

    onPinchStart: ({ event }) => event.preventDefault(),
    onPinch: ({ offset: [d, a], down, vdva: [vd, va], last, memo = [theta.getValue(), last_pointer_angle.getValue(), zoom.getValue(), last_pointer_dist.getValue()] }) => {
      // alert(mx, my)
      // let [theta, lpa] = memo
      let [t, lpa, z, lpd] = memo;
      console.log(d);
      let d_rel = d/250;
      let curr_zoom = zoom.getValue();

      setControlZoom({
        zoom: _.clamp(z + (d_rel - lpd)*Math.sign(curr_zoom)*Math.abs(curr_zoom**0.9), minZoom.getValue(), maxZoom.getValue()), 
        last_pointer_dist: d_rel,

        immediate: down, 
        // config: { velocity: vd, decay: true }
      });

      setControlRot({ 
        theta: t + (a - lpa),
        last_pointer_angle: a,

        immediate: down, 
        // config: { velocity: va, decay: true }
      })

      return memo
    },

    onPinchEnd: ({ vdva: [vd, va] }) => {
      // alert(`va = ${va}`)
      // let scaleVd = (
      //   vd/100 * (zoom.getValue() - minZoom.getValue()) * (maxZoom.getValue() - minZoom.getValue())
      // );
      let limit = 2
      let newZoom = _.clamp(zoom.getValue() + vd, minZoom.getValue(), maxZoom.getValue());
      let newVd = vd * (newZoom - 50); //_.clamp(vd/100, -limit, limit)
      // let vd_norm = scale;
      setNewVdDebug({
        newVd_test: newVd
      })
      // setControlZoom({
      //   zoom: newZoom, 
      //   // new velocity relative to proximity to min/max values
      //   config: { velocity: newVd, decay: true }
      // })
      setControlRot({
        // set theta so it's remembered next time
        theta: va,

        config: { velocity: va, decay: true }
      })
    },


    onDragStart: ({event}) => event.preventDefault(),
    onDrag: ({ down, movement, velocity, direction, memo = pos.getValue()}) => {
  
      // change according to this formula:
      // move (x, y) in the opposite direction of drag (pan with cursor)
      // divide by canvas size to scale appropriately
      // multiply by 2 to correct scaling on viewport
      //                                    current img size
      // const [dx, dy] = [mx, my].map(a => - a);
      
      // let [x, y, dx, dy, theta, zoom] = testTouchGrid;
  
      setControlPos({ 
        pos: addV(movement, memo), 
        immediate: down, 
        config: { velocity: scale(direction, velocity), decay: true }
      })
      return memo
    },

    onDragEnd: () => {
      // setControlPos({
      //   pos: addV(movement, memo), 
      //   config: { velocity: scale(direction, velocity), decay: true }
      // })
    },

  }, { event: { passive: false, capture: false }, domTarget: touchTarget })
  
  useEffect(touchBind, [touchBind]);

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
    <div 
      className="fullSize" 
      // style={{
      //   width: "100%",
      //   height: "100%"
      // }} 
      {...props}
      ref={touchTarget}
    >
      <animated.canvas 
        id="mandelbrot" 
        // className="fullSize"
        // width={window.innerWidth}
        // height={window.innerHeight}
        width={canvasSize}
        height={canvasSize}
        alt={grid.x.interpolate(d => grid.x.value + d)}
        style= {{
          width: canvasSize * zoomFactor,
          height: canvasSize * zoomFactor,
          transform: interpolate([pos], ([x, y]) =>
            `matrix3d(
              1, 0, 0, 0,
              0, 1, 0, 0,
              0, 0, 1, 0,
              0, 0, 0, 1
            )`
          ),
        }}
        ref={canvas} 
      />

      <animated.div
        id="touch-test"
        style={{
          position: 'absolute',
          top: 0,
          width: 500,
          height: 500,
          zIndex: -1,
          // transform: theta_test.interpolate(t => 
          //   `rotateZ(${t}deg)`  
          // )
          transform: interpolate([pos, theta, zoom], ([x, y], t, z) =>
          // transform: pos.interpolate((x, y) =>
            `
            translate(${x}px, ${y}px)
            rotate(${t}deg)
            scale(${z/100})
            `
            // `matrix3d(
            //   1, 0, 0, 0,
            //   0, 1, 0, 0,
            //   0, 0, 1, 0,
            //   ${x}, ${y}, 0, 1
            // )`
          ),
        }}
      >
        <div style={{
          display: 'flex-column',
          position: "relative",
          // height: 0,
        }}>
          <Typography>
            pos: <animated.span>{pos.interpolate((x, y) => `x=${x.toFixed(3)}, y=${y.toFixed(3)}`)}</animated.span>; 
            theta = <animated.span>{theta.interpolate(t => t.toFixed(3))}</animated.span>,
            {/* zoom = {zoom_test.getValue()} */}
          </Typography>
          <img 
            src={"https://upload.wikimedia.org/wikipedia/commons/2/21/Mandel_zoom_00_mandelbrot_set.jpg"}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              // position: 'relative',
            }}
          />
        </div>
      </animated.div>

      <Card>
        <Typography 
          style ={{
            zIndex: 1
          }}>
          theta: <animated.span>{theta.interpolate(t => t.toFixed(3))}</animated.span>, 
          zoom: <animated.span>{zoom.interpolate(z => z.toFixed(3))}</animated.span>, 
          vd: <animated.span>{newVd_test.interpolate(z => z.toFixed(3))}</animated.span>,
          {/* x: <animated.span>{grid.dx.interpolate(d => (grid.x.value + d).toFixed(3))}</animated.span>, 
          y: <animated.span>{grid.dy.interpolate(d => (grid.y.value + d).toFixed(3))}</animated.span> */}
        </Typography>
      </Card>
      {/* <Button variant="contained" color="primary" onClick={e => {
          let t0 = performance.now();
          fillProc(ctx);
          let t1 = performance.now()
          setPtime(t1 - t0);
        }}>{ptime.toFixed(2)}</Button>

      <Button variant="contained" color="primary" onClick={e => {
          let t0 = performance.now();
          fillProcFast(ctx);
          let t1 = performance.now()
          setPtime2(t1 - t0);
        }
      }>{ptime2.toFixed(2)}</Button>
      
      <Button variant="contained" color="secondary" onClick={e => async function () {
          let t0 = performance.now();
          await fillProcAsync(ctx);
          let t1 = performance.now()
          setPtime3(t1 - t0);
        }()
      }>{ptime3.toFixed(2)}</Button>

      <Button variant="outlined" onClick={e => clearCanvas(ctx)}>clear</Button> */}

      <hr />

      <Slider
        defaultValue={maxI}
        valueLabelDisplay="on"
        step={1}
        min={1}
        max={100}
        style={{ 
          width: 200,
          margin: 30,
        }}
        onChange={ (e, v) => setMaxI(v) }
      />
    </div>
  )
}