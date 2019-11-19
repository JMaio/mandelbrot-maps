import React, { useState } from 'react';
import { Paper, Typography, Fab } from '@material-ui/core';
import { animated, useSpring } from 'react-spring';
import { useDrag } from 'react-use-gesture';


export default function RotationControl() {

  const [{ theta, itheta, prevTheta, revs, dt }, set] = useSpring(() => ({
    theta: 150,
    itheta: 0,
    prevTheta: 0,
    revs: 0,
    dt: 0,
    // xy: [0, 0],
  }))

  const clampAngle = t => ((t + 360) % 360 + 360) % 360

  var elemProps = { x: 0, y: 0, width: 0, height: 0 };

  const [elemCenter, setElemCenter] = useState([0, 0]);
  // const [elemOffset, setElemOffset] = useState([0, 0]);

  const outerSize = 160;
  const innerSize = 70;

  const bind = useDrag(({ xy: [x, y], initial: [ix, iy], previous: [px, py], first, last, memo = prevTheta.getValue() }) => {

    if (last) {
      return
    }
    if (first) {
      const [cx, cy] = [elemProps.x + elemProps.width / 2, elemProps.y + elemProps.height / 2];
      // console.log(cx, cy)
      setElemCenter([cx, cy]);
      // setElemOffset([ix - cx, iy - cy]);
      set({
        // remember initial angle
        itheta: 360 * Math.atan2(-(ix - cx), iy - cy) / (Math.PI * 2),
        // theta: theta.value + dt.value,
        prevTheta: 0,
        dt: 0
      })
      return;
      //   set({ initialTheta: Math.atan2(iy - (pos.y + pos.height / 2), ix - (pos.x + pos.width / 2)) });
    }
    // set({ xy: [x, y] })

    // console.log(ix, x, iy, y)
    const [cx, cy] = elemCenter;

    // const 
    // if (abs(theta.value + dt.value) >)
    const newTheta = Math.atan2(-(x - cx), y - cy);
    // const diff = newTheta - memo - ;
    // console.log(prevTheta);
    // if (Math.abs(diff) > Math.PI && Math.abs(prevTheta) > Math.PI / 2 - 0.5) {
    //   console.log(diff);
    //   set({
    //     revs: revs.value + 1 * Math.sign(diff)
    //   });
    // }

    const d = (360 * newTheta / (Math.PI * 2)) - itheta.getValue() - memo;

    // set current angle, delta since last
    set({
      theta: theta.value + d,
      prevTheta: newTheta,
      // xy: [x, y] 
    });

    // if (last) {
    //   set({ 
    //     // theta: theta.value + dt,
    //     // dt: 0 
    //   })
    // }

    return memo;
  })

  return (
    <div style={{
      width: outerSize,
      height: outerSize,
      display: 'flex',
      position: 'relative',
    }}>
      <animated.div style={{
        width: 10,
        height: 10,
        backgroundColor: "red",
        // transform: xy.interpolate((x, y) => `translate3d(${x - 5}px, ${y - 5}px, 0)`),
        // transform: xy.interpolate(xy => `translate(${x}, ${y})`),
        position: "fixed",
        top: 0,
        left: 0,
      }} />
      <Paper {...bind()}
        ref={el => {
          if (!el) return;
          let r = el.getBoundingClientRect();
          elemProps = { x: r.x, y: r.y, width: r.width, height: r.height }
          // console.log(pos);
        }}
        style={{
          borderRadius: '50rem',
          width: outerSize,
          height: outerSize,
        }} >
        {/* <div style={{
          width: 10,
          height: 10,
          backgroundColor: "aqua",
          transform: `translate3d(${- 5}px, ${- 5}px, 0)`,
          // transform: xy.interpolate(xy => `translate(${x}, ${y})`),
          position: "absolute",
          top: "50%",
          left: "50%",
          zIndex: 2,
        }} /> */}
        <animated.div
          style={{
            transform: theta.interpolate(t =>
              `rotate(${t}deg)`
              // ((360 + theta.value + dt) % 360)
              // .toFixed(1)
            ),
            width: "100%",
            height: "100%"
          }}>
          <Typography style={{ userSelect: "none" }}>hi</Typography>
        </animated.div>
      </Paper>

      <Fab style={{
        width: innerSize,
        height: innerSize,
        borderRadius: '50rem',
        backgroundColor: "#2196f3",
        display: 'flex',
        position: 'absolute',
        left: '50%',
        top: '50%',
        margin: -innerSize / 2,
      }}>
        {/* <CardContent > */}
        <Typography style={{
          color: "#fff",
          margin: 'auto',
        }}>
          <animated.span>{
            theta.interpolate(t => t.toFixed(1))
            // dt.interpolate(dt =>
            //   clampAngle(theta.value + dt)
            //     .toFixed(1)
            // )
          }</animated.span>° (<animated.span>{revs.interpolate(r => r)}</animated.span>)
        </Typography>
      </Fab>
    </div>
  )
  // }
};