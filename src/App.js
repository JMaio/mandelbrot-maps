import React, { Fragment } from 'react';
import './App.css';
import { Grid, Typography, Container } from '@material-ui/core';
import ZoomBar, { } from './components/ZoomBar';
import RotationControl from './components/RotationControl';

import 'typeface-roboto';
import MandelbrotRenderer from './components/MandelbrotRenderer.jsx';
import { useSpring } from 'react-spring';


function App() {

  let defaultSpringConfig = {mass: 1, tension: 100 , friction: 200};

  const controlPos = useSpring(() => ({
    pos: [0, 0],

    config: defaultSpringConfig,
  }));

  const controlRot = useSpring(() => ({
    theta: 0,
    last_pointer_angle: 0,
    itheta: 0,

    config: defaultSpringConfig,
  }))

  const controlZoom = useSpring(() => ({
    zoom: 100,
    last_pointer_dist: 0,

    minZoom: 50,
    maxZoom: 1000000,

    config: {mass: 1, tension: 600 , friction: 50},
  }))
  

  return (
    <Fragment>
      <MandelbrotRenderer
        style={{
          position: 'absolute',
          zIndex: 0,
        }}
        pos={controlPos}
        rot={controlRot}
        zoom={controlZoom}
      />
      <Grid
        container
        direction="column"
        justify="space-evenly"
        alignItems="flex-end"
      > 
        <ZoomBar 
          controller={controlZoom}
        />


        <RotationControl 
          className="Control"
          controller={controlRot} 
        />
      </Grid>
    </Fragment>
  );
}

export default App;
