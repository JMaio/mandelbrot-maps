import React, { useState } from 'react';
import './App.css';
import { Grid, Card, Typography, Slider, Switch } from '@material-ui/core';

// import 'typeface-roboto';
import MandelbrotRenderer from './components/MandelbrotRenderer.jsx';
import { useSpring, animated } from 'react-spring';
import JuliaRenderer from './components/JuliaRenderer';
import { useWindowSize } from './components/utils';
import SettingsMenu from "./components/SettingsMenu";

import InfoDialog from './components/InfoDialog';

function App() {

  const size = useWindowSize();

  let defaultSpringConfig = { mass: 1, tension: 100, friction: 200 };

  // this multiplier subdivides the screen space into smaller increments
  // to allow for velocity calculations to not immediately decay, due to the
  // otherwise small scale that is being mapped to the screen.
  const screenScaleMultiplier = 1e-7;
  // make default device pixel ratio 1
  const [dpr, setDpr] = useState(1);

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
  };

  const [showInfo, setShowInfo] = useState(false);

  let toggleInfo = () => setShowInfo(!showInfo);

  let controls = {
    coords: useState(false),
    miniViewer: useState(true),
    maxI: useState(250),
    aa: useState(false),
    dpr: useState(false),
    fps: useState(false),
  };

  let toggleVal = ([v, setV]) => setV(!v);

  let settings = [{
    title: "Interface",
    items: {
      miniViewer: {
        name: 'Mini viewers', 
        ctrl: <Switch 
          color="primary"
          checked={controls.miniViewer[0]} 
          onChange={() => toggleVal(controls.miniViewer)} 
        />
      },
      coords: {
        name: 'Show coordinates', 
        ctrl: <Switch 
          color="primary"
          checked={controls.coords[0]} 
          onChange={() => toggleVal(controls.coords)} 
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
        placement: "top"
      },
      dpr: {
        // https://stackoverflow.com/a/12830454/9184658
          // // There is a downside that values like 1.5 will give "1.50" as the output. A fix suggested by @minitech:
          // var numb = 1.5;
          // numb = +numb.toFixed(2);
          // // Note the plus sign that drops any "extra" zeroes at the end.
          // // It changes the result (which is a string) into a number again (think "0 + foo"),
          // // which means that it uses only as many digits as necessary.
        name: `Use pixel ratio (${+window.devicePixelRatio.toFixed(3) || 1})`, 
        ctrl: <Switch
          checked={controls.dpr[0]} 
          color="primary"
          onChange={() => {
            let useDpr = !controls.dpr[0];
            // console.log(useDpr ? window.devicePixelRatio : 1);
            setDpr(useDpr ? window.devicePixelRatio : 1)
            controls.dpr[1](useDpr);
          }}
        />
      },
      aa: {
        name: 'Anti-aliasing (slow)', 
        ctrl: <Switch
          color="primary"
          checked={controls.aa[0]} 
          onChange={() => toggleVal(controls.aa)}
        />
      },
      fps: {
        name: 'Show FPS', 
        ctrl: <Switch
          color="primary"
          checked={controls.fps[0]} 
          onChange={() => toggleVal(controls.fps)}
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
            <animated.span>{mandelbrotControls.pos[0].pos.interpolate((x) => (x * screenScaleMultiplier).toFixed(7))}</animated.span> : x<br />
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
            dpr={dpr}
            showFps={controls.fps[0]}
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
            dpr={dpr}
          />
        </Grid>
      </Grid>

      <SettingsMenu 
        settings={settings}
        reset={() => reset()}
        toggleInfo={() => toggleInfo()}
      />

      <InfoDialog ctrl={[showInfo, setShowInfo]} />

    </Grid>
  );
}

export default App;
