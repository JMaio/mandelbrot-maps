import React, { useState } from 'react';
import './App.css';
import { Grid, Card, Typography } from '@material-ui/core';
import ZoomBar from './components/ZoomBar';
import IterationSlider from './components/IterationSlider';
import RotationControl from './components/RotationControl';

import 'typeface-roboto';
import MandelbrotRenderer from './components/MandelbrotRenderer.jsx';
import { useSpring, animated } from 'react-spring';
import JuliaRenderer from './components/JuliaRenderer';
import { useWindowSize } from './components/utils';


function App() {

  const size = useWindowSize();

  let defaultSpringConfig = { mass: 1, tension: 100, friction: 200 };

  let maxIter = useState(250);
  // eslint-disable-next-line
  let [maxI, setMaxI] = maxIter;

  // this multiplier subdivides the screen space into smaller increments
  // to allow for velocity calculations to not immediately decay, due to the
  // otherwise small scale that is being mapped to the screen.
  const screenScaleMultiplier = 1e-7;

  const startPos = [-0.743030, 0.126433];
  // const startPos = [-.7426482, .1271875 ];
  // const startPos = [-0.1251491, -0.8599647];
  const startZoom = 165.0;

  const mandelbrotControls = {
    pos: useSpring(() => ({
      pos: startPos.map(x => x / screenScaleMultiplier),
      config: defaultSpringConfig,
    })),

    rot: useSpring(() => ({
      theta: 0,
      last_pointer_angle: 0,
      itheta: 0,
      config: defaultSpringConfig,
    })),

    zoom: useSpring(() => ({
      zoom: startZoom,
      last_pointer_dist: 0,
  
      minZoom: 0.5,
      maxZoom: 100000,
  
      config: { mass: 1, tension: 600, friction: 50 },
    })),
  };

  const juliaControls = {
    pos: useSpring(() => ({
      pos: [0, 0],
      config: defaultSpringConfig,
    })),

    rot: useSpring(() => ({
      theta: 0,
      last_pointer_angle: 0,
      itheta: 0,
      config: defaultSpringConfig,
    })),

    zoom: useSpring(() => ({
      zoom: 0.5,
      last_pointer_dist: 0,
  
      minZoom: 0.5,
      maxZoom: 100000,
  
      config: { mass: 1, tension: 600, friction: 50 },
    })),
  };

  // const [{ pos }, setPos] = mandelbrotControls.pos;
  
  return (
    <Grid container>
      <Grid
        item
        container
        direction={size.width < size.height ? "column" : "row"}
        justify="center"
        className="fullSize"
        style={{
          position: "absolute",
        }}
      >
        <Card
        style={{
          width: "auto",
          position: "absolute",
          zIndex: 2,
          right: 0,
          top: 0,
          margin: 20,
          padding: 5,
        }}
        >
          <Typography align="right">
            <animated.span>{mandelbrotControls.pos[0].pos.interpolate((x, y) => (x * screenScaleMultiplier).toFixed(7))}</animated.span> : x<br />
            <animated.span>{mandelbrotControls.pos[0].pos.interpolate((x, y) => (y * screenScaleMultiplier).toFixed(7))}</animated.span> : y
          </Typography>
        </Card>
        <Grid item xs className="renderer">
          <MandelbrotRenderer
            controls={mandelbrotControls}
            maxiter={maxI}
            screenmult={screenScaleMultiplier}
          />
        </Grid>
        <Grid item xs className="renderer" 
          // style={{ display: "none" }}
          >
          <JuliaRenderer
            c={mandelbrotControls.pos[0].pos}
            controls={juliaControls}
            maxiter={maxI}
            screenmult={screenScaleMultiplier}
          />
        </Grid>
      </Grid>
      <Grid
        item
        container
        direction="column"
        justify="space-evenly"
        alignItems="flex-end"
      >
        <ZoomBar
          controller={juliaControls.zoom}
        />

        <RotationControl
          className="Control"
          controller={mandelbrotControls.rot}
          style={{
            display: "none",
          }}
        />

        <IterationSlider
          maxiter={maxIter}
          style={{
            display: "none",
          }}
        />
      </Grid>
    </Grid>
  );
}

export default App;
