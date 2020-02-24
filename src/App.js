import React, { useState } from 'react';
import './App.css';
import { Grid, Card, Typography, Fab, Slider, Switch } from '@material-ui/core';
import ZoomBar from './components/ZoomBar';
import IterationSlider from './components/IterationSlider';
import RotationControl from './components/RotationControl';

// import 'typeface-roboto';
import MandelbrotRenderer from './components/MandelbrotRenderer.jsx';
import { useSpring, animated } from 'react-spring';
import JuliaRenderer from './components/JuliaRenderer';
import { useWindowSize } from './components/utils';
import SettingsMenu from "./components/SettingsMenu";

function App() {

  const size = useWindowSize();

  let defaultSpringConfig = { mass: 1, tension: 100, friction: 200 };

  // eslint-disable-next-line
  // let [maxI, setMaxI] = maxIter;

  // this multiplier subdivides the screen space into smaller increments
  // to allow for velocity calculations to not immediately decay, due to the
  // otherwise small scale that is being mapped to the screen.
  const screenScaleMultiplier = 1e-7;

  const startPos = [-0.743030, 0.126433];
  // const startPos = [-.7426482, .1271875 ];
  // const startPos = [-0.1251491, -0.8599647];
  const startZoom = 165.0;
  const miniSize = useState(100);

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

  let resetPosSpringConfig  = { tension: 200, friction: 75 };
  let resetZoomSpringConfig = { tension: 300, friction: 60 };

  let reset = () => {
    mandelbrotControls.pos[1]({
      pos: [0, 0],
      config: resetPosSpringConfig,
    });
    mandelbrotControls.zoom[1]({
      zoom: 1,
      config: resetZoomSpringConfig,
    });
    
    juliaControls.pos[1]({
      pos: [0, 0],
      config: resetPosSpringConfig,
    });
    juliaControls.zoom[1]({
      zoom: 1,
      config: resetZoomSpringConfig,
    });
  }

  let controls = {
    coords: useState(false),
    miniViewer: useState(true),
    maxI: useState(250),
    aa: useState(false),
    dpr: useState(true),
  };

  let settings = [{
    title: "Interface",
    items: {
      coords: {
        name: 'Show coordinates', 
        ctrl: <Switch 
          checked={controls.coords[0]} 
          onChange={() => controls.coords[1](!controls.coords[0])} 
        />
      },
      miniViewer: {
        name: 'Mini viewers', 
        ctrl: <Switch 
          checked={controls.miniViewer[0]} 
          onChange={() => controls.miniViewer[1](!controls.miniViewer[0])} 
        />
      },
    }
  }, {
    title: "Graphics",
    items: {
      iterations: {
        name: 'Iterations', 
        ctrl: <Slider 
          min={5}
          max={1000}
          step={5}
          defaultValue={250}
          valueLabelDisplay="auto"
          value={controls.maxI[0]}
          marks={[
            { value: 5, label: 5 },
            { value: 250, label: 250 },
            { value: 500, label: 500 },
            { value: 750, label: 750 },
            { value: 1000, label: 1000 },
          ]}
          onChange={(e, val) => controls.maxI[1](val)}
          // onChange={(e, val) => console.log(val)}
        />,
        placement: "top"},
      dpr: {
        name: `Use device pixel ratio (${window.devicePixelRatio || 1})`, 
        ctrl: <Switch
          checked={controls.dpr[0]} 
          onChange={() => controls.dpr[1](!controls.dpr[0])}
        />
      },
      aa: {
        name: 'Anti-aliasing (slow!)', 
        ctrl: <Switch
          checked={controls.aa[0]} 
          onChange={() => controls.aa[1](!controls.aa[0])}
        />
      },
    }
  }]
  // const [{ pos }, setPos] = mandelbrotControls.pos;
  
  return (
    <Grid container>
      <Grid
        item
        container
        direction={size.width < size.height ? "column-reverse" : "row"}
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
          padding: 8,
          display: controls.coords[0] ? "block" : "none",
          // borderRadius: 100,
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
            maxiter={controls.maxI[0]}
            screenmult={screenScaleMultiplier}
            miniSize={miniSize}
            enableMini={controls.miniViewer[0]}
            aa={controls.aa[0]}
            dpr={controls.dpr[0] ? window.devicePixelRatio : 1}
          />
        </Grid>
        <Grid item xs className="renderer" 
          // style={{ display: "none" }}
          >
          <JuliaRenderer
            c={mandelbrotControls.pos[0].pos}
            controls={juliaControls}
            maxiter={controls.maxI[0]}
            screenmult={screenScaleMultiplier}
            miniSize={miniSize}
            enableMini={controls.miniViewer[0]}
            aa={controls.aa[0]}
            dpr={controls.dpr[0] ? window.devicePixelRatio : 1}
          />
        </Grid>
      </Grid>
      {/* <Grid
        item
        container
        direction="column"
        justify="space-evenly"
        alignItems="flex-end"
      >
        {/* <ZoomBar
          controller={mandelbrotControls.zoom}
          style={{
            display: "none",
          }}
        />

        <RotationControl
          className="Control"
          controller={mandelbrotControls.rot}
          style={{
            display: "none",
          }}
        /> */}

        {/* <IterationSlider
          maxiter={controls.maxIter}
          style={{
            display: "none",
          }}
        />
      </Grid> */}
      <SettingsMenu 
        settings={settings}
        reset={() => reset()}
      />
      {/* <Fab size="small" color="primary" aria-label="settings" style={{
        position: "absolute",
        bottom: 0,
        right: 0,
        zIndex: 2,
        margin: "1em",
      }}>
        <SettingsIcon />
      </Fab> */}
    </Grid>
  );
}

export default App;
