import React from 'react';
import { Paper, Typography, Fab } from '@material-ui/core';
import { animated } from 'react-spring';
import { useDrag } from 'react-use-gesture';

export default function RotationControl(props) {
  const [{ theta, itheta }, set] = props.controller;

  const clampAngle = (t) => ((t % 360) + 360) % 360;

  const radToDeg = (r) => (360 * r) / (2 * Math.PI);

  var elemProps = { x: 0, y: 0, width: 0, height: 0 };

  // const [elemCenter, setElemCenter] = useState([0, 0]);
  // const [elemOffset, setElemOffset] = useState([0, 0]);

  const outerSize = 160;
  const innerSize = 70;

  const bind = useDrag(({ xy: [x, y], initial: [ix, iy], first, memo = theta.getValue() }) => {
    const [cx, cy] = [elemProps.x + elemProps.width / 2, elemProps.y + elemProps.height / 2];
    if (first) {
      // console.log(cx, cy)
      // setElemCenter([cx, cy]);
      // setElemOffset([ix - cx, iy - cy]);
      set({
        theta: memo,
        // remember initial angle (of the cursor)
        itheta: radToDeg(Math.atan2(-(ix - cx), iy - cy)),
      });
      return memo;
    }

    const newTheta = radToDeg(Math.atan2(-(x - cx), y - cy));

    // const d = (360 * newTheta / (Math.PI * 2)) // - itheta.getValue() - memo;

    // set current angle, delta since last
    set({
      theta: memo + clampAngle(newTheta - itheta.getValue()),
      // prevTheta: theta.value,
      // xy: [x, y]
      immediate: true,
    });

    return memo;
  });

  return (
    <div
      style={{
        width: outerSize,
        height: outerSize,
        display: 'flex',
        position: 'relative',
        zIndex: 2,
      }}
      {...props}
    >
      {/* <animated.div style={{
        width: 10,
        height: 10,
        backgroundColor: "red",
        // transform: xy.interpolate((x, y) => `translate3d(${x - 5}px, ${y - 5}px, 0)`),
        // transform: xy.interpolate(xy => `translate(${x}, ${y})`),
        position: "fixed",
        top: 0,
        left: 0,
      }} /> */}
      <Paper
        {...bind()}
        ref={(el) => {
          if (!el) return;
          let r = el.getBoundingClientRect();
          elemProps = { x: r.x, y: r.y, width: r.width, height: r.height };
          // console.log(pos);
        }}
        style={{
          borderRadius: '50rem',
          width: outerSize,
          height: outerSize,
        }}
      >
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
            transform: theta.interpolate(
              (t) => `rotate(${t}deg)`,
              // ((360 + theta.value + dt) % 360)
              // .toFixed(1)
            ),
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Typography style={{ userSelect: 'none' }}>(N)</Typography>
        </animated.div>
      </Paper>

      <Fab
        style={{
          width: innerSize,
          height: innerSize,
          borderRadius: '50rem',
          backgroundColor: '#2196f3',
          display: 'flex',
          position: 'absolute',
          left: '50%',
          top: '50%',
          margin: -innerSize / 2,
        }}
      >
        {/* <CardContent > */}
        <Typography
          style={{
            color: '#fff',
            margin: 'auto',
          }}
        >
          <animated.span>
            {
              theta.interpolate((t) => clampAngle(t).toFixed(0))
              // dt.interpolate(dt =>
              //   clampAngle(theta.value + dt)
              //     .toFixed(1)
              // )
            }
          </animated.span>
          °{/* (<animated.span>{revs.interpolate(r => r)}</animated.span>) */}
        </Typography>
      </Fab>
    </div>
  );
  // }
}
