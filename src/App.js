import React, { Fragment, useState } from 'react';
import './App.css';
import { Grid } from '@material-ui/core';
import ZoomBar, { } from './components/ZoomBar';
import IterationSlider from './components/IterationSlider';
import RotationControl from './components/RotationControl';
// import * from "./renderers/";

import 'typeface-roboto';
import MandelbrotRenderer from './components/MandelbrotRenderer.jsx';
import { useSpring } from 'react-spring';


function App() {

  let defaultSpringConfig = { mass: 1, tension: 100, friction: 200 };

  let maxIter = useState(100);
  // eslint-disable-next-line
  let [maxI, setMaxI] = maxIter;

  // let [glRenderer, setGlRenderer] = useState(false);
  // let toggleRenderer = () => {};


  // render function passed from renderer
  // let [render, setRender] = useState();

  // const changeRenderFunc = f => setRender(f);

  const controlPos = useSpring(() => ({
    // pos: [-1, 0],
    pos: [0, 0],
    // pos: [0.45193823302480385, -0.3963913556925211],
    // pos: [-0.743030, -0.126433],

    // onRest: () => {
    //   // render the fractal
    //   // render();
    // },
    config: defaultSpringConfig,
  }));
  
  // const controlScreenPos = useSpring(() => ({
  //   screenpos: [0, 0],
    
  //   config: defaultSpringConfig,
  //   //  {
  //   //   ...
  //   //   immediate: true,
  //   // }
  // }))

  const controlRot = useSpring(() => ({
    theta: 0,
    last_pointer_angle: 0,
    itheta: 0,

    config: defaultSpringConfig,
  }))

  const controlZoom = useSpring(() => ({
    zoom: 1.0,
    last_pointer_dist: 0,

    minZoom: 0.5,
    maxZoom: 100000,

    config: { mass: 1, tension: 600, friction: 50 },
  }))

  return (
    <Fragment>
      <MandelbrotRenderer
        style={{
          position: 'absolute',
          zIndex: 0,
        }}
        pos={controlPos}
        // screenpos={controlScreenPos}
        rot={controlRot}
        zoom={controlZoom}
        maxiter={maxI}
        // renderer={glRenderer ? }
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
          maxiter={maxIter}
          style={{
            display: "none",
          }}
        />

        {/* <FormControlLabel
          control={
            // <Switch checked={state.checkedA} onChange={handleChange('checkedA')} value="checkedA" />
            <Switch onChange={() => setGlRenderer(!glRenderer)} />
          }
          label="use GL"
          style={{
            display: "none",
          }}
        /> */}
      </Grid>
    </Fragment>
  );
}

export default App;
