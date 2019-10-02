import React, { useState } from 'react';
import { Card, Paper, CardContent, Typography, Box, Fab } from '@material-ui/core';
import { animated, useSpring, config } from 'react-spring';
import { useDrag } from 'react-use-gesture';

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

  const [{ rotation, deltaTheta }, set] = useSpring(() => ({ rotation: 0, deltaTheta: 0 }))
  
  const outerSize = 160;
  const innerSize = 70;
  var pos = {x: 0, y: 0, width: 0, height: 0};

  const bind = useDrag(({ down, direction, movement: [x, y], initial: [ix, iy], first, last }) => {
    // if (first) {
    //   console.log(ix, iy)
    //   return
    // }
    
    let elemOffset = {
      x: pos.x - ix + pos.width / 2, 
      y: pos.y - iy + pos.height / 2
    };
    console.log(elemOffset);
  
    const initialTheta = Math.atan2(iy - (pos.y + pos.height / 2), ix - (pos.x + pos.width / 2));
    const newTheta     = Math.atan2( y - elemOffset.y,  x - elemOffset.x);
    const dt           = (newTheta - initialTheta) / (Math.PI * 2) * 360 + 360;
  
    console.log(initialTheta, newTheta);
    // console.log(ix, x);
    // console.log(iy, y);
  
    set({ deltaTheta: dt })

    if (last) {
      set({ rotation: (rotation.value + dt) % 360 })
    }
    // return {style: {
    //   backgroundColor: "red",
    // }}
  })

  return (
    <div style={{
      width: outerSize,
      height: outerSize,
      display: 'flex',
      position: 'relative',
    }}>
      <Paper { ...bind() } 
      ref={ el => {
        if (!el) return;
        let r = el.getBoundingClientRect();
        pos = {x: r.x, y: r.y, width: r.width, height: r.height}
        console.log(pos);
      }}
      style={{
        borderRadius: '50rem',
        width: outerSize,
        height: outerSize,
      }} >
        <animated.div 
          style= {{
            transform: deltaTheta.interpolate(t => `rotate(${(rotation.value + t)}deg)`),
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
          <animated.span>{deltaTheta.interpolate(t => ((rotation.value + t) % 360).toFixed(1))}</animated.span>°
        </Typography>
      </Fab>
    </div>
  )
  // }
};