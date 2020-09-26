import { Grid, ThemeProvider } from '@material-ui/core';
import React, { useState } from 'react';
import { useSpring } from 'react-spring';
import { vScale } from 'vec-la-fp';
import './App.css';
import {
  ViewerRotationControl,
  ViewerXYControl,
  ViewerZoomControl,
} from './common/types';
import CoordinatesCard from './components/info/CoordinatesCard';
import InfoDialog from './components/InfoDialog';
import JuliaRenderer from './components/JuliaRenderer';
// import 'typeface-roboto';
import MandelbrotRenderer from './components/MandelbrotRenderer.jsx';
import SettingsMenu from './components/SettingsMenu';
import { SettingsContext, SettingsProvider } from './components/SettingsWrapper';
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
            <SettingsContext.Consumer>
              {({ settings }) => (
                <CoordinatesCard
                  show={settings.coordinates}
                  mandelbrot={mandelbrotControls.xyCtrl[0].xy}
                  screenScaleMultiplier={screenScaleMultiplier}
                />
              )}
            </SettingsContext.Consumer>

            <Grid item xs className="renderer">
              <MandelbrotRenderer
                controls={mandelbrotControls}
                maxiter={controls.maxI[0]}
                screenmult={screenScaleMultiplier}
                miniSize={miniSize}
                enableMini={controls.miniViewer[0]}
                crosshair={controls.crosshair[0]}
                aa={controls.aa[0]}
                showFps={controls.fps[0]}
                dpr={1}
              />
            </Grid>
            <Grid item xs className="renderer">
              <JuliaRenderer
                c={mandelbrotControls.xyCtrl[0].xy}
                controls={juliaControls}
                maxiter={controls.maxI[0]}
                screenmult={screenScaleMultiplier}
                miniSize={miniSize}
                enableMini={controls.miniViewer[0]}
                aa={controls.aa[0]}
                dpr={1}
              />
            </Grid>
          </Grid>

          <SettingsMenu reset={() => reset()} toggleInfo={() => toggleInfo()} />

          <InfoDialog ctrl={[showInfo, setShowInfo]} />
        </Grid>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;
