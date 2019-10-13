import React, { useRef, useEffect, useState } from "react";
import Complex from 'complex.js';
import _ from 'lodash';
import { Typography, Button, Slider } from "@material-ui/core";
import { useDrag } from "react-use-gesture";
import { useSpring, animated } from "react-spring";
// import { performance } from 'perf_hooks';


export default function MandelbrotRenderer(props) {

  const canvas = useRef(null);
  const canvasSize = 600;

  const bounds = {x: [-1.5, 0.5], y: [-1, 1]};
  const [maxI, setMaxI] = useState(23);

  const [ctx, setCtx] = useState(null);

  // const [toggle, setToggle] = useState(false);


  const [{x, y, dx, dy, zoom}, setGrid] = useSpring(() => ({
    x: 0, 
    y: 0, 

    dx: 0,
    dy: 0,

    zoom: 100
  }));

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

  const bind = useDrag(({ movement: [mx, my], down, last}) => {
    const [dx, dy] = [mx, my].map(a => -2 * a / canvasSize);
    
    setGrid({
      dx: dx, 
      dy: dy,
    });

    // setDown(down);

    if (last) {
      setGrid({
        x: x.value + dx,
        y: y.value + dy,
        
        dx: 0,
        dy: 0,
      })
      clearCanvas(ctx)
      fillProc(ctx)
    }

    // ()down ? fillProcFast(ctx) : null;
  }, { event: { passive: false, capture: false }, domTarget: canvas })

  useEffect(bind, [bind])

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
    >
      <canvas 
        id="mandelbrot" 
        // className="fullSize"
        // width={window.innerWidth}
        // height={window.innerHeight}
        width={canvasSize}
        height={canvasSize}
        ref={canvas} 
      />
      <Typography>
        x: <animated.span>{dx.interpolate(d => (x.value + d).toFixed(3))}</animated.span>, 
        y: <animated.span>{dy.interpolate(d => (y.value + d).toFixed(3))}</animated.span>
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