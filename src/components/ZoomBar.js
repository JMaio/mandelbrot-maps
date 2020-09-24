import React, { useState, useRef, useEffect } from 'react';
import { Paper, Fab, Typography } from '@material-ui/core';
import { ReactComponent as PlusIcon } from '../plus-icon.svg';
import { ReactComponent as MinusIcon } from '../minus-icon.svg';
import TransparentFab from './TransparentFab';
import { useSpring, animated } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import { clamp } from 'lodash';

// https://upmostly.com/tutorials/setinterval-in-react-components-using-hooks
function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default function ZoomBar(props) {
  let fabSize = 70;
  let maxHeight = 240;

  // let [minZoom, maxZoom] = [0.01, 1000]
  // const [zoom, setZoom] = useState(100) // useSpring(() => ({ zoom: 100 }));

  const [{ zoom, minZoom, maxZoom }, setZoom] = props.controller;
  // const [{ zoom }, setZoom] = useSpring(() => ({ zoom: 100, config: {
  //   friction: 50,
  //   tension: 600,
  // }}));

  const zoomClick = (dir) => {
    // zoom in a particular direction
    const z = Math.sign(dir) * (1e-1 * zoom.getValue() + 1);
    setZoom({
      zoom: clamp(zoom.getValue() + z, minZoom.getValue(), maxZoom.getValue()),
    });
  };

  return (
    <div
      className="Control"
      style={{
        width: fabSize,
        display: 'flex',
        zIndex: 10,
        ...props.style,
      }}
    >
      <Paper
        style={{
          borderRadius: '5em',
          maxHeight: maxHeight,
          margin: 'auto',
          display: 'flex',
          flexDirection: 'column-reverse',
          justifyContent: 'space-between',
        }}
      >
        <TransparentFab
          onClick={(e) => {
            e.preventDefault();
            zoomClick(-1);
          }}
        >
          <MinusIcon />
        </TransparentFab>
        <div
          style={{
            height: fabSize,
            position: 'relative',
          }}
        >
          <ZoomBarFab diameter={fabSize} zoom={zoom} zoomControl={setZoom} minZoom={minZoom} maxZoom={maxZoom} />
        </div>
        <TransparentFab
          onClick={(e) => {
            e.preventDefault();
            zoomClick(1);
          }}
        >
          <PlusIcon />
        </TransparentFab>
      </Paper>
    </div>
  );
}

export function ZoomBarFab(props) {
  const [{ y }, set] = useSpring(() => ({
    y: 0,
    config: {
      friction: 30,
      tension: 400,
      //  clamp: true,
    },
  }));

  const [zoom, setZoom] = [props.zoom, props.zoomControl];

  const [gestureDown, setGestureDown] = useState(false);
  const [zoomMult, setZoomMult] = useState(1);
  const ref = React.useRef(null);

  const reset = () => {
    setZoom({ zoom: 1 });
  };

  // determine speed to zoom at based on distance from center of the control
  // updates zoom every 50ms based on the multiplier
  useInterval(
    () => {
      let oldZoom = zoom.getValue();
      const z = clamp(
        oldZoom + 2 * 3e-5 * oldZoom ** 0.8 * zoomMult,
        props.minZoom.getValue(),
        props.maxZoom.getValue(),
      );
      setZoom({ zoom: z });
      // increase zoom multiplier based on time elapsed
      setZoomMult(zoomMult * 1.02);
    },
    gestureDown ? 100 : null,
  );

  const bind = useDrag(
    ({ down, movement: [x, y], event, first, last }) => {
      // only prevent default between first and last event
      // first: prevents browser events
      // last: allows buttons to activate and ripple
      // event.preventDefault();
      !first && !last && event.preventDefault();

      // tell zoom listener if drag is happening
      setGestureDown(down);

      const limit = 80;
      const clampY = clamp(y, -limit, limit);

      setZoomMult(down ? -Math.sign(clampY) * Math.abs(clampY / 8) ** 4 : 0);
      set({ y: down ? clampY : 0 });
    },
    { event: { passive: false, capture: false }, domTarget: ref },
  );

  useEffect(bind, [bind]);

  return (
    <animated.div
      ref={ref}
      style={{
        transform: y.interpolate((y) => `translateY(${y}px)`),
        borderRadius: '50rem',
        width: props.diameter,
        height: props.diameter,

        marginLeft: -props.diameter / 2,
        marginTop: -props.diameter / 2,
        top: '50%',
        left: '50%',
        position: 'absolute',
        zIndex: 1,
      }}
    >
      <Fab
        onClick={(e) => {
          // if click registered and fab not moved, trigger reset
          if (y.getValue() === 0) {
            reset();
          }
        }}
        style={{
          backgroundColor: '#2196f3',
          width: props.diameter,
          height: props.diameter,
        }}
      >
        <Typography style={{ color: '#fff' }}>
          <animated.span>{zoom.interpolate((z) => z.toPrecision(6))}</animated.span>
        </Typography>
      </Fab>
    </animated.div>
  );
}
