import React, { useRef, useEffect, useState } from "react";
import Complex from 'complex.js';
import _ from 'lodash';
import { Typography, Button } from "@material-ui/core";
// import { performance } from 'perf_hooks';


export default function MandelbrotRenderer(props) {

  const canvas = useRef(null);
  const canvasSize = 600;

  const bounds = {x: [-1.5, 0.5], y: [-1, 1]};
  const maxI = 63;

  // const [ctx, setCtx] = useState(null)

  const [toggle, setToggle] = useState(false);

  function linspace(start, stop, cardinality) {
    let step = (stop - start) / cardinality;
    return _.range(start, stop, step);
  }

  const fillDiag = ctx => {
    ctx.fillStyle = "#444";

    for (let i = 0; i < canvasSize; i++) {
      console.log("square: " + i);
      ctx.fillRect(i, i, 1, 1);
    }
  }

  const fillProcFast = ctx => {
    const [xl, xr] = bounds.x;
    const [yb, yt] = bounds.y;

    console.log(canvasSize / 2);
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
          if (z.abs() > 4) { draw = false; break; }
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
    const [xl, xr] = bounds.x;
    const [yb, yt] = bounds.y;
    linspace(xl, xr, canvasSize).forEach((re, x) => {
      linspace(yb, yt, canvasSize).forEach((im, y) => {
        let c = Complex(re, im);
        var z = Complex.ZERO;
        var draw = true;
        // console.log(z.toString());
        for (let iter = 0; iter < maxI; iter++) {
          z = z.mul(z).add(c);
          if (z.abs() > 4) { draw = false; break; }
        }
        ctx.fillStyle = draw ? "#000" : "#fff";
        ctx.fillRect(x, y, 1, 1);
      });
    });
  };

  const toggleRect = ctx => {
    const fill = () => ctx.fillRect(0, 0, 200, 200);
    const clear = () => ctx.clearRect(0, 0, 200, 200);
    toggle ? clear() : fill();
    setToggle(!toggle);
    // useEffect(() => {
    //   console.log("click");
    // })
  }

  const [ptime, setPtime] = useState(0);
  const [ptime2, setPtime2] = useState(0);

  useEffect(() => {
    console.log("canvas loaded");
    const ctx = canvas.current.getContext("2d");
    // canvas.current.ready(() => {
    fillProcFast(ctx);
  })


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
      {/* <Button color="primary" onClick={e => {
          let t0 = performance.now();
          fillProc();
          let t1 = performance.now()
          setPtime(t1 - t0);
        }}>{ptime}</Button>

      <Button color="primary" onClick={e => {
          let t0 = performance.now();
          fillProcFast();
          let t1 = performance.now()
          setPtime2(t1 - t0);
        }}>{ptime2}</Button> */}
    </div>
  )
}