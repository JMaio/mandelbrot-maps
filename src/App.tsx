import { Grid, ThemeProvider } from '@material-ui/core';
import React, { useState } from 'react';
import { OpaqueInterpolation, useSpring } from 'react-spring';
import { vScale } from 'vec-la-fp';
import './App.css';
import {
  ViewerRotationControl,
  ViewerXYControl,
  ViewerZoomControl,
  ZoomType,
} from './common/types';
import CoordinatesCard from './components/info/CoordinatesCard';
import ChangeCoordinatesCard from './components/info/ChangeCoordinatesCard';
import InfoDialog from './components/info/InfoDialog';
import JuliaRenderer from './components/render/JuliaRenderer';
// import 'typeface-roboto';
import MandelbrotRenderer from './components/render/MandelbrotRenderer';
import ServiceWorkerWrapper from './components/ServiceWorkerWrapper';
import SettingsProvider, { SettingsContext } from './components/settings/SettingsContext';
import SettingsMenu from './components/settings/SettingsMenu';
import { useWindowSize } from './components/utils';
import theme from './theme/theme';

export const defaultSpringConfig = { mass: 1, tension: 100, friction: 200 };

export const resetPosSpringConfig = { mass: 1, tension: 200, friction: 75 };
export const resetZoomSpringConfig = { mass: 1, tension: 300, friction: 60 };

export const startPos: [number, number] = [-0.7746931, 0.1242266];
export const startZoom = 85.0;
export const startTheta = 0.6;
export const screenScaleMultiplier = 1e-7;

function App(): JSX.Element {
  const size = useWindowSize();

  // this multiplier subdivides the screen space into smaller increments
  // to allow for velocity calculations to not immediately decay, due to the
  // otherwise small scale that is being mapped to the screen.

  // const startPos = [-.7426482, .1271875 ];
  // const startPos = [-0.1251491, -0.8599647];

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
      theta: startTheta, // should this be rad or deg? rad
      // last_pointer_angle: 0,
      // itheta: 0,
      config: defaultSpringConfig,
    })),

    zoomCtrl: useSpring<ViewerZoomControl>(() => ({
      z: startZoom,
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
      theta: startTheta, // should this be rad or deg? rad
      // last_pointer_angle: 0,
      // itheta: 0,
      config: defaultSpringConfig,
    })),

    zoomCtrl: useSpring<ViewerZoomControl>(() => ({
      z: 0.5 as number,
      // last_pointer_dist: 0,

      minZoom: 0.5,
      maxZoom: 100000,

      config: { mass: 1, tension: 600, friction: 50 },
    })),
  };

  const reset = () => {
    mandelbrotControls.xyCtrl[1]({
      xy: [0, 0],
      config: resetPosSpringConfig,
    });
    mandelbrotControls.zoomCtrl[1]({
      z: 1,
      config: resetZoomSpringConfig,
    });

    juliaControls.xyCtrl[1]({
      xy: [0, 0],
      config: resetPosSpringConfig,
    });
    juliaControls.zoomCtrl[1]({
      z: 1,
      config: resetZoomSpringConfig,
    });
  };

  const [showInfo, setShowInfo] = useState(false);

  const toggleInfo = () => setShowInfo(!showInfo);

  // const { settings } = useSettings();

  return (
    <ThemeProvider theme={theme}>
      <ServiceWorkerWrapper />
      <SettingsProvider>
        <Grid container>
          <SettingsContext.Consumer>
            {({ settings }) => (
              <Grid
                item
                container
                direction={
                  (size.width || 1) < (size.height || 0) ? 'column-reverse' : 'row'
                }
                justify="center"
                className="fullSize"
                style={{
                  position: 'absolute',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    margin: 20,
                    width: 'auto',
                  }}
                >
                  <CoordinatesCard
                    show={settings.showCoordinates}
                    mandelbrot={{
                      xy: mandelbrotControls.xyCtrl[0].xy,
                      zoom: mandelbrotControls.zoomCtrl[0].z as OpaqueInterpolation<
                        ZoomType
                      >,
                      theta: mandelbrotControls.rotCtrl[0].theta,
                    }}
                    screenScaleMultiplier={screenScaleMultiplier}
                  />
                  <ChangeCoordinatesCard
                    show={settings.showCoordinates}
                    mandelbrot={mandelbrotControls}
                    screenScaleMultiplier={screenScaleMultiplier}
                  />
                </div>
                <Grid item xs className="renderer">
                  <MandelbrotRenderer
                    controls={mandelbrotControls}
                    screenScaleMultiplier={screenScaleMultiplier}
                    {...settings}
                  />
                </Grid>
                <Grid item xs className="renderer">
                  <JuliaRenderer
                    c={mandelbrotControls.xyCtrl[0].xy}
                    controls={juliaControls}
                    screenmult={screenScaleMultiplier}
                    {...settings}
                  />
                </Grid>
              </Grid>
            )}
          </SettingsContext.Consumer>

          <SettingsMenu reset={() => reset()} toggleInfo={() => toggleInfo()} />

          <InfoDialog ctrl={[showInfo, setShowInfo]} />
        </Grid>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;
