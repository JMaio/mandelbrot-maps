import React from 'react';
import { Card, Paper, CardContent, Typography, Box, Fab } from '@material-ui/core';
import { animated, useSpring } from 'react-spring';
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

export default class RotationControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      position: 40
    };
    // const [{ xy }, set] = useSpring(() => ({ xy: [0, 0] }))

  }

  render() {
    let outerSize = 150;
    let innerSize = 70;


    return (
      <div style={{
        width: outerSize,
        height: outerSize,
        display: 'flex',
        position: 'relative',
      }}>
        <Paper style={{
          borderRadius: '50rem',
          width: outerSize,
          height: outerSize,
        }}>
          <Paper></Paper>
        </Paper>
        <Fab style={{
          width: innerSize,
          height: innerSize,
          borderRadius: '50rem',
          backgroundColor: "#efefef",
          display: 'flex',
          position: 'absolute',
          left: '50%',
          top: '50%',
          margin: -innerSize / 2,
        }}>
          {/* <CardContent > */}
          <Typography style={{
            margin: 'auto',
          }}>
            {this.state.position}°
                        </Typography>
          {/* </CardContent> */}
        </Fab>
      </div>
    )
  }
}