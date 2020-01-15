import React, { Fragment, useState } from 'react';
import './App.css';
import { Grid } from '@material-ui/core';
import ZoomBar, { } from './components/ZoomBar';
import IterationSlider from './components/IterationSlider';
import RotationControl from './components/RotationControl';

import 'typeface-roboto';
import MandelbrotRenderer from './components/MandelbrotRenderer.jsx';
import { useSpring } from 'react-spring';


function App() {

  let defaultSpringConfig = {mass: 1, tension: 100 , friction: 200};

  let maxIter = useState(45);
  let [maxI, setMaxI] = maxIter;


  // render function passed from renderer
  // let [render, setRender] = useState();

  // const changeRenderFunc = f => setRender(f);

  const controlPos = useSpring(() => ({
    pos: [-0.743030, -0.126433],

    onRest: () => {
      // render the fractal
      // render();
    },
    config: defaultSpringConfig,
  }));

  const controlRot = useSpring(() => ({
    theta: 0,
    last_pointer_angle: 0,
    itheta: 0,

    config: defaultSpringConfig,
  }))

  const controlZoom = useSpring(() => ({
    zoom: 1,
    last_pointer_dist: 0,

    minZoom: 0.5,
    maxZoom: 100000,

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
        maxiter={maxI}
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
          style={{
            display: "none",
          }}
        />

        <IterationSlider
          maxIter={maxI}
          setMaxIter={setMaxI}
        />

        {/* <Swit */}
      </Grid>
    </Fragment>
  );
}

export default App;
