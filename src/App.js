import React, { Fragment, useState } from 'react';
import './App.css';
import { Grid } from '@material-ui/core';
import ZoomBar from './components/ZoomBar';
import IterationSlider from './components/IterationSlider';
import RotationControl from './components/RotationControl';

import 'typeface-roboto';
import MandelbrotRenderer from './components/MandelbrotRenderer.jsx';
import { useSpring } from 'react-spring';
import JuliaRenderer from './components/JuliaRenderer';
import { useWindowSize } from './components/utils';


function App() {

  const size = useWindowSize();

  let defaultSpringConfig = { mass: 1, tension: 100, friction: 200 };

  let maxIter = useState(100);
  // eslint-disable-next-line
  let [maxI, setMaxI] = maxIter;

  const mandelbrotControls = {
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
      zoom: 1.0,
      last_pointer_dist: 0,
  
      minZoom: 0.5,
      maxZoom: 100000,
  
      config: { mass: 1, tension: 600, friction: 50 },
    })),
  }
  
  return (
    <Fragment>
      <Grid
        container
        direction={size.width < size.height ? "column" : "row"}
        justify="center"
        className="fullSize"
        style={{
          position: "absolute",
        }}
      >
        <Grid item xs className="renderer">
          <MandelbrotRenderer
            controls={mandelbrotControls}
            maxiter={maxI}
          />
        </Grid>
        <Grid item xs className="renderer">
          <JuliaRenderer
            controls={mandelbrotControls}
            maxiter={maxI}
          />
        </Grid>
      </Grid>
      <Grid
        container
        direction="column"
        justify="space-evenly"
        alignItems="flex-end"
      >
        <ZoomBar
          controller={mandelbrotControls.zoom}
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
    </Fragment>
  );
}

export default App;
