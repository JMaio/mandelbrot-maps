import React, { useState } from 'react';
import { Card, Paper, CardContent, Typography, Box, Fab } from '@material-ui/core';
import { animated, useSpring, config } from 'react-spring';
import { useDrag, addV } from 'react-use-gesture';
import { clamp } from 'lodash';

export function RotationControlFun() {
  const [{ x }, set] = useSpring(() => ({ x: 0 }))

  const bind = useDrag(({ down, movement: [x, y], direction: [xDir] }) => {
    const limit = 80;
    const dir = xDir < 0 ? -1 : 1
    const nextX = Math.abs(x) > limit ? limit * Math.sign(x) : x;
    console.log(nextX);
    set({ x: down ? nextX : 0 })
  })


  return (
    <animated.div
      {...bind()}
      style={{
        transform: x.interpolate(x => `translate3D(${x}px, 0, 0)`),
        width: 80,
        height: 80,
        background: "hotpink",
        borderRadius: 16,
      }} />
  )

}

export default function RotationControl() {

  const [{ theta, itheta, dt }, set] = useSpring(() => ({ 
    theta: 150, 
    itheta: 0, 
    dt: 0,
    // xy: [0, 0],
  }))

  var elemProps = {x: 0, y: 0, width: 0, height: 0};
  
  const [elemCenter, setElemCenter] = useState([0, 0]);
  const [elemOffset, setElemOffset] = useState([0, 0]);

  const outerSize = 160;
  const innerSize = 70;

  const bind = useDrag(({ xy: [x, y], initial: [ix, iy], first, last }) => {

    
    if (first) {
      const [cx, cy] = [elemProps.x + elemProps.width / 2, elemProps.y + elemProps.height / 2];
      // console.log(cx, cy)
      setElemCenter([cx, cy]);
      // setElemOffset([ix - cx, iy - cy]);
      set({ 
        // remember initial angle
        itheta: 360 * Math.atan2(iy - cy, ix - cx) / (Math.PI * 2),
        theta: theta.value + dt.value,
        dt: 0 
      })
      return;
      //   set({ initialTheta: Math.atan2(iy - (pos.y + pos.height / 2), ix - (pos.x + pos.width / 2)) });
    }
    // set({ xy: [x, y] })
    
    // console.log(ix, x, iy, y)
    const [cx, cy] = elemCenter;

    // const 
    const newTheta = Math.atan2(y - cy, x - cx);
    const d        = (360 * newTheta / (Math.PI * 2)) - itheta.value;
  
    // set current angle, delta since last
    set({ 
      dt: d, 
      // xy: [x, y] 
    })

    if (last) {
      set({ 
        // theta: theta.value + dt,
        // dt: 0 
      })
    }

    // return memo;
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
      <Paper { ...bind() } 
      ref={ el => {
        if (!el) return;
        let r = el.getBoundingClientRect();
        elemProps = {x: r.x, y: r.y, width: r.width, height: r.height}
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
          style= {{
            transform: dt.interpolate(d => 
              `rotate(${theta.value + d}deg)`
              // ((360 + theta.value + dt) % 360)
              // .toFixed(1)
            ),
            width: "100%",
            height: "100%"
          }}>
          <Typography style= {{ userSelect: "none" }} >hi</Typography>
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
            dt.interpolate(d => 
              (((theta.value + d + 360) % 360 + 360) % 360)
              .toFixed(1)
            )
          }</animated.span>°
        </Typography>
      </Fab>
    </div>
  )
  // }
};