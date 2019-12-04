import React, { useRef, useEffect, useState } from "react";
import Complex from 'complex.js';
import _ from 'lodash';
import { Typography, Button, Slider } from "@material-ui/core";

import { useDrag, addV, subV, useGesture } from "react-use-gesture";
import { add, scale, dist } from 'vec-la'

import { useSpring, animated, interpolate, config } from "react-spring";
// import { performance } from 'perf_hooks';


export default function MandelbrotRenderer(props) {

  const touchTarget = useRef(null);
  const testTouchTarget = useRef(null);
  const canvas = useRef(null);
  const canvasSize = 200;
  const zoomFactor = 3;

  const bounds = {x: [-1.5, 0.5], y: [-1, 1]};
  const [maxI, setMaxI] = useState(23);

  const [ctx, setCtx] = useState(null);

  // const [toggle, setToggle] = useState(false);

  // {x, y, dx, dy, theta, zoom}
  const [grid, setGrid] = useSpring(() => ({
    x: 0, 
    y: 0, 

    dx: 0,
    dy: 0,

    theta: 0,

    zoom: 100,

  }));

  // const trans1 = ({x, y, theta, zoom}) => 
  //   `translate3d(${x / 3.5}px,${y / 3.5}px,0)`
  // ;

  // let gridVals = () => [Object.values(grid)];

  // const [down, setDown] = useState(false);

  function linspace(start, stop, cardinality) {
    let step = (stop - start) / cardinality;
    return _.range(start, stop, step);
  }

  const clearCanvas = ctx => {
    let c = canvas.current;
    ctx.clearRect(0, 0, c.width, c.height)
  }

  // const fillDiag = ctx => {
  //   ctx.fillStyle = "#444";

  //   for (let i = 0; i < canvasSize; i++) {
  //     console.log("square: " + i);
  //     ctx.fillRect(i, i, 1, 1);
  //   }
  // }

  const fillProcFast = ctx => {
    let {x, y, zoom} = grid;
    const [xl, xr] = [x.value-1, x.value+1];
    const [yb, yt] = [y.value-1, y.value+1];

    clearCanvas(ctx);
    console.log(canvasSize / 2);
    console.log(zoom);
    console.log(yb);
    // let l = linspace(yt, 0, canvasSize / 2)
    // l.push(0);
    // console.log(l);
    ctx.fillStyle = "#444";

    const lsRe = linspace(xl, xr, canvasSize);
    const lsIm = linspace(yt, 0, canvasSize / 2);
    lsIm.push(0);

    lsRe.forEach((re, x) => {
      // let l = 
      // l.push(0);
      lsIm.forEach((im, y) => {
        // y > 180 && console.log(y);
        let c = Complex(re, im);
        var z = Complex.ZERO;
        var draw = true;
        // console.log(z.toString());
        for (let iter = 0; iter < maxI; iter++) {
          z = z.mul(z).add(c);
          if (z.abs() > 2) { draw = false; break; }
        }
        if (draw) {
          ctx.fillRect(x, y, 1, 1);
          if (y < canvasSize) {
            ctx.fillRect(x, (canvasSize - y), 1, 1);
          }
        }
      });
    });
  };


  const fillProc = ctx => {
    let {x, y, dx, dy} = grid;
    const [xs, ys] = [x.value + dx.value, y.value + dy.value]
    const [xl, xr] = [xs-1, xs+1];
    const [yb, yt] = [ys-1, ys+1];
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
        ctx.fillStyle = draw ? "#000" : "#fff";
        ctx.fillRect(x, y, 1, 1);
      });
    });
  };

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

  // const toggleRect = ctx => {
  //   const fill = () => ctx.fillRect(0, 0, 200, 200);
  //   const clear = () => ctx.clearRect(0, 0, 200, 200);
  //   toggle ? clear() : fill();
  //   setToggle(!toggle);
  //   // useEffect(() => {
  //   //   console.log("click");
  //   // })
  // }
  // // 
  // const [{pos, d_pos, theta_test, zoom_test}, setTestTouchGrid] = useSpring(() => ({
  //   // testTouchGrid: [
  //   // // [x, y, dx, dy, theta, zoom]
  //   pos: [0, 0],
  //   d_pos: [0, 0],

  //   theta_test: 0,

  //   zoom_test: 100,
  //   config: {mass: 1, tension: 100 , friction: 200},

  // }));

  const [{ pos }, setTestTouchGridPos] = useSpring(() => ({
    // testTouchGrid: [
    // // [x, y, dx, dy, theta, zoom]
    pos: [0, 0],
    d_pos: [0, 0],

    
    config: {mass: 1, tension: 100 , friction: 200},

  }));

  const [{ theta_test, last_pointer_angle, zoom_test, last_pointer_dist }, setTestTouchGridTheta] = useSpring(() => ({

    theta_test: 0,
    last_pointer_angle: 0,

    zoom_test: 1,
    last_pointer_dist: 0,

    config: {mass: 1, tension: 100 , friction: 200},

  }))

  // touch target bind for testing
  const testTouchBind = useGesture({

    onPinchStart: ({ event }) => {
      event.preventDefault();
    },
    onPinch: ({ offset: [d, a], down, vdva: [vd, va], last, memo = [theta_test.getValue(), last_pointer_angle.getValue(), zoom_test.getValue(), last_pointer_dist.getValue()] }) => {
      // alert(mx, my)
      // let [theta, lpa] = memo
      let [theta, lpa, zt, lpd] = memo;
      console.log(d);
      let d_rel = d/250;

      setTestTouchGridTheta({ 
        zoom_test: zt + (d_rel - lpd), 
        last_pointer_dist: d_rel,
        // pos: [a, a],
        theta_test: theta + (a - lpa),
        last_pointer_angle: a,
        immediate: down, 
        config: { velocity: va, decay: true }
      })
      // if (last) {
      //   setTestTouchGridTheta({ 
      //     // zoom_test: d / 200, 
      //     // // pos: [a, a],
      //     theta_test: va,
      //     // immediate: down, 
      //     config: { velocity: va, decay: true }
      //   })
      //   // memo += a
      //   // return memo + a
      // }

      return memo
    //   // alert(theta_test.getValue())
    },
    onPinchEnd: ({ vdva: [vd, va] }) => {
      // alert(`va = ${va}`)
      setTestTouchGridTheta({ 
        // zoom_test: d / 200, 
        // // pos: [a, a],
        theta_test: va,
        // immediate: down, 
        config: { velocity: va, decay: true }
      })
      // alert(theta_test.getValue())
    },


    // onDragStart: ({event}) => event.preventDefault(),

    onDrag: ({ down, movement, velocity, direction, memo = pos.getValue()}) => {
  
      // change according to this formula:
      // move (x, y) in the opposite direction of drag (pan with cursor)
      // divide by canvas size to scale appropriately
      // multiply by 2 to correct scaling on viewport
      //                                    current img size
      // const [dx, dy] = [mx, my].map(a => - a);
      
      // let [x, y, dx, dy, theta, zoom] = testTouchGrid;
  
      setTestTouchGridPos({ 
        pos: add(movement, memo), 
        immediate: down, 
        config: { velocity: scale(direction, velocity), decay: true }
      })
      return memo
    },

    // onDragEnd: () => {},

  }, { event: { passive: false, capture: false }, domTarget: testTouchTarget })
  // const testTouchBind = useDrag(({ movement, down, event, first, velocity, direction, memo = pos.getValue()}) => {
  //   !first && event.preventDefault();

  //   // change according to this formula:
  //   // move (x, y) in the opposite direction of drag (pan with cursor)
  //   // divide by canvas size to scale appropriately
  //   // multiply by 2 to correct scaling on viewport
  //   //                                    current img size
  //   // const [dx, dy] = [mx, my].map(a => - a);
    
  //   // let [x, y, dx, dy, theta, zoom] = testTouchGrid;

  //   setTestTouchGrid({ 
  //     pos: add(movement, memo), 
  //     immediate: down, 
  //     config: { velocity: scale(direction, velocity), decay: true }
  //   })

    
  //   // if (last) {
  //   //   // let [vx, vy] = vxvy //.map(v => _.clamp(v, -8, 8));
  //   //   // // vy = _.clamp(vy, -8, 8);
  //   //   // // extrapolate from last angle
  //   //   // let [x, y] = pos.getValue()
  //   //   // console.log(x, y)
  //   //   // console.log(mx, my)
  //   //   // console.log(vxvy)
  //   //   setTestTouchGrid({
  //   //     pos: addV(memo, movement),
  //   //     d_pos: [0, 0],
  //   //     // immediate: false,

  //   //       // 0,
  //   //       // 0,
  //   //     // theta: 0,
  //   //     // ]
  //   //     // y: y.value + dy,
  //   //   });
  //   //   // clearCanvas(ctx);
  //   //   // fillProc(ctx);
  //   // }
  //   return memo

  //   // ()down ? fillProcFast(ctx) : null;
  // }, { event: { passive: false, capture: false }, domTarget: testTouchTarget });

  useEffect(testTouchBind, [testTouchBind]);

  // the current binding for the canvas movement
  const bind = useDrag(({ movement: [mx, my], down, event, first, last }) => {
    !first && event.preventDefault();

    // change according to this formula:
    // move (x, y) in the opposite direction of drag (pan with cursor)
    // divide by canvas size to scale appropriately
    // multiply by 2 to correct scaling on viewport
    const [dx, dy] = [mx, my].map(a => -2 * a / (canvasSize * zoomFactor));
    
    setGrid({
      dx: dx, 
      dy: dy,
    });

    // setDown(down);
    let {x, y} = grid;

    if (last) {
      setGrid({
        x: x.value + dx,
        y: y.value + dy,
        
        dx: 0,
        dy: 0,
      });
      // clearCanvas(ctx);
      // fillProc(ctx);
    }

    // ()down ? fillProcFast(ctx) : null;
  }, { event: { passive: false, capture: false }, domTarget: touchTarget });

  useEffect(bind, [bind]);

  const [ptime, setPtime] = useState(0);
  const [ptime2, setPtime2] = useState(0);
  const [ptime3, setPtime3] = useState(0);

  useEffect(() => {
    // console.log("canvas loaded");
    const ctx = canvas.current.getContext("2d");
    setCtx(ctx);
    
    // if(!down) {
    //   clearCanvas(ctx)
    //   fillProc(ctx)
    // }
    // canvas.current.ready(() => {
    // fillProcFast(ctx);
  }, [])


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
        ref={testTouchTarget}
        style={{
          position: 'absolute',
          top: 0,
          width: 500,
          height: 500,
          // transform: theta_test.interpolate(t => 
          //   `rotateZ(${t}deg)`  
          // )
          transform: interpolate([pos, theta_test, zoom_test], ([x, y], t, z) =>
          // transform: pos.interpolate((x, y) =>
            `
            translate(${x}px, ${y}px)
            rotate(${t}deg)
            scale(${z})
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
            theta = <animated.span>{theta_test.interpolate(t => t.toFixed(3))}</animated.span>,
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

      <Typography>
        theta: <animated.span>{theta_test.interpolate(t => t.toFixed(3))}</animated.span>, 
        zoom: <animated.span>{zoom_test.interpolate(z => z.toFixed(3))}</animated.span>, 
        x: <animated.span>{grid.dx.interpolate(d => (grid.x.value + d).toFixed(3))}</animated.span>, 
        y: <animated.span>{grid.dy.interpolate(d => (grid.y.value + d).toFixed(3))}</animated.span>
      </Typography>
      <Button variant="contained" color="primary" onClick={e => {
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

      <Button variant="outlined" onClick={e => clearCanvas(ctx)}>clear</Button>

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