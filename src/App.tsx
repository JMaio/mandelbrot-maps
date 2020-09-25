import { Card, Grid, Slider, Switch, ThemeProvider, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { animated, useSpring } from 'react-spring';
import { vScale } from 'vec-la-fp';
import './App.css';
import {
  ViewerRotationControl,
  ViewerXYControl,
  ViewerZoomControl,
} from './common/types';
import InfoDialog from './components/InfoDialog';
import JuliaRenderer from './components/JuliaRenderer';
// import 'typeface-roboto';
import MandelbrotRenderer from './components/MandelbrotRenderer.jsx';
import SettingsMenu from './components/SettingsMenu';
import { SettingsProvider } from './components/SettingsWrapper';
import { useWindowSize } from './components/utils';
import theme from './theme/theme';

// const AppContext = React.createContext();

// export interface ContextSettings {}

function App(): JSX.Element {
  const size = useWindowSize();

  const defaultSpringConfig = { mass: 1, tension: 100, friction: 200 };

  // this multiplier subdivides the screen space into smaller increments
  // to allow for velocity calculations to not immediately decay, due to the
  // otherwise small scale that is being mapped to the screen.
  const screenScaleMultiplier = 1e-7;
  // make default device pixel ratio 1
  const [dpr, setDpr] = useState(1);

  const startPos: [number, number] = [-0.7740798, 0.1230918];
  // const startPos = [-.7426482, .1271875 ];
  // const startPos = [-0.1251491, -0.8599647];
  const startZoom = 165.0;
  const miniSize = useState(100);

  // interface posInterface extends UseSpringBaseProps {
  //   pos: [number, number],
  //   config: SpringConfig,
  // }

  const mandelbrotControls = {
    xyCtrl: useSpring<ViewerXYControl>(() => ({
      xy: vScale(1 / screenScaleMultiplier, startPos),
      config: defaultSpringConfig,
    })),

    rotCtrl: useSpring<ViewerRotationControl>(() => ({
      theta: 0,
      // last_pointer_angle: 0,
      // itheta: 0,
      config: defaultSpringConfig,
    })),

    zoomCtrl: useSpring<ViewerZoomControl>(() => ({
      zoom: startZoom,
      // last_pointer_dist: 0,

      minZoom: 0.5,
      maxZoom: 100000,

      config: { mass: 1, tension: 600, friction: 50 },
    })),
  };

  // const [a] = mandelbrotControls.xyCtrl;
  // typeof a.xy;

  const juliaControls = {
    xyCtrl: useSpring<ViewerXYControl>(() => ({
      xy: [0, 0] as [number, number],
      config: defaultSpringConfig,
    })),

    rotCtrl: useSpring<ViewerRotationControl>(() => ({
      theta: 0,
      // last_pointer_angle: 0,
      // itheta: 0,
      config: defaultSpringConfig,
    })),

    zoomCtrl: useSpring<ViewerZoomControl>(() => ({
      zoom: 0.5,
      // last_pointer_dist: 0,

      minZoom: 0.5,
      maxZoom: 100000,

      config: { mass: 1, tension: 600, friction: 50 },
    })),
  };

  const resetPosSpringConfig = { mass: 1, tension: 200, friction: 75 };
  const resetZoomSpringConfig = { mass: 1, tension: 300, friction: 60 };

  const reset = () => {
    mandelbrotControls.xyCtrl[1]({
      xy: [0, 0],
      config: resetPosSpringConfig,
    });
    mandelbrotControls.zoomCtrl[1]({
      zoom: 1,
      config: resetZoomSpringConfig,
    });

    juliaControls.xyCtrl[1]({
      xy: [0, 0],
      config: resetPosSpringConfig,
    });
    juliaControls.zoomCtrl[1]({
      zoom: 1,
      config: resetZoomSpringConfig,
    });
  };

  const [showInfo, setShowInfo] = useState(false);

  const toggleInfo = () => setShowInfo(!showInfo);

  const controls = {
    miniViewer: useState(true),
    crosshair: useState(true),
    coords: useState(false),
    maxI: useState(250),
    aa: useState(false),
    dpr: useState(false),
    fps: useState(false),
  };

  // alternate between boolean values
  // const toggleVal = (
  //   [v, setV]) => {
  //     setV(!v)
  //   };

  const settings = [
    {
      title: 'Interface',
      items: {
        miniViewer: {
          name: 'Mini viewers',
          ctrl: (
            <Switch
              color="primary"
              checked={controls.miniViewer[0]}
              onChange={(e) => controls.miniViewer[1](e.target.checked)}
            />
          ),
        },
        crosshair: {
          name: 'Crosshair',
          ctrl: (
            <Switch
              color="primary"
              checked={controls.crosshair[0]}
              onChange={(e) => controls.crosshair[1](e.target.checked)}
            />
          ),
        },
        coords: {
          name: 'Show coordinates',
          ctrl: (
            <Switch
              color="primary"
              checked={controls.coords[0]}
              onChange={(e) => controls.coords[1](e.target.checked)}
            />
          ),
        },
      },
    },
    {
      title: 'Graphics',
      items: {
        iterations: {
          name: 'Iterations',
          ctrl: (
            <Slider
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
              onChange={(e, val) => {
                switch (typeof val) {
                  case 'number':
                    controls.maxI[1](val);
                    break;
                  default:
                    break;
                }
              }}
              // onChange={(e, val) => console.log(val)}
            />
          ),
          placement: 'top',
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
          ctrl: (
            <Switch
              checked={controls.dpr[0]}
              color="primary"
              onChange={() => {
                const useDpr = !controls.dpr[0];
                // console.log(useDpr ? window.devicePixelRatio : 1);
                setDpr(useDpr ? window.devicePixelRatio : 1);
                controls.dpr[1](useDpr);
              }}
            />
          ),
        },
        aa: {
          name: 'Anti-aliasing (slow)',
          ctrl: (
            <Switch
              color="primary"
              checked={controls.aa[0]}
              onChange={(e) => controls.aa[1](e.target.checked)}
              // onChange={() => toggleVal(controls.aa)}
            />
          ),
        },
        fps: {
          name: 'Show FPS',
          ctrl: (
            <Switch
              color="primary"
              checked={controls.fps[0]}
              onChange={(e) => controls.fps[1](e.target.checked)}
              // onChange={() => toggleVal(controls.fps)}
            />
          ),
        },
      },
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <SettingsProvider>
        <Grid container>
          <Grid
            item
            container
            direction={(size.width || 1) < (size.height || 0) ? 'column-reverse' : 'row'}
            justify="center"
            className="fullSize"
            style={{
              position: 'absolute',
            }}
          >
            <Card
              style={{
                width: 'auto',
                position: 'absolute',
                zIndex: 2,
                right: 0,
                top: 0,
                margin: 20,
                padding: 8,
                display: controls.coords[0] ? 'block' : 'none',
                // borderRadius: 100,
              }}
            >
              <Typography align="right">
                {/* https://www.typescriptlang.org/docs/handbook/basic-types.html#tuple */}
                {/* https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types */}
                <animated.span>
                  {mandelbrotControls.xyCtrl[0].xy.interpolate(
                    // @ts-expect-error: Function call broken in TS, waiting till v9 to fix
                    (x, y) => `${(x * screenScaleMultiplier).toFixed(7)} : x`,
                  )}
                </animated.span>
                <br />
                <animated.span>
                  {mandelbrotControls.xyCtrl[0].xy.interpolate(
                    // @ts-expect-error: Function call broken in TS, waiting till v9 to fix
                    (x, y) => `${(y * screenScaleMultiplier).toFixed(7)} : y`,
                  )}
                </animated.span>
              </Typography>
            </Card>
            <Grid item xs className="renderer">
              <MandelbrotRenderer
                controls={mandelbrotControls}
                maxiter={controls.maxI[0]}
                screenmult={screenScaleMultiplier}
                miniSize={miniSize}
                enableMini={controls.miniViewer[0]}
                crosshair={controls.crosshair[0]}
                aa={controls.aa[0]}
                dpr={dpr}
                showFps={controls.fps[0]}
              />
            </Grid>
            <Grid
              item
              xs
              className="renderer"
              // style={{ display: "none" }}
            >
              <JuliaRenderer
                c={mandelbrotControls.xyCtrl[0].xy}
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
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;
