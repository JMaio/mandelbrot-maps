import { Grid, ThemeProvider } from '@material-ui/core';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSpring } from 'react-spring';
import './App.css';
import {
  currentLocation,
  useHashLocation,
  useHashNavigator,
  ViewerURLManager,
} from './common/routing';
import {
  ViewerControlSprings,
  ViewerLocation,
  ViewerRotationControl,
  ViewerXYControl,
  ViewerZoomControl,
} from './common/types';
import { useWindowSize, warpToPoint } from './common/utils';
import { springsConfigs, viewerOrigin } from './common/values';
import CoordinateInterface from './components/info/CoordinateInterface';
import InfoDialog from './components/info/InfoDialog';
import JuliaRenderer from './components/render/JuliaRenderer';
// import 'typeface-roboto';
import MandelbrotRenderer from './components/render/MandelbrotRenderer';
import ServiceWorkerWrapper from './components/ServiceWorkerWrapper';
import SettingsProvider, { SettingsContext } from './components/settings/SettingsContext';
import SettingsMenu from './components/settings/SettingsMenu';
import theme from './theme/theme';
import OrbitPlotter from './components/orbit_plotter/OrbitPlotter';

function App(): JSX.Element {
  const size = useWindowSize();

  // if app is started with a hash location, assume
  // it should be the starting position
  // detects hash updates
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loc, navigate] = useHashLocation();

  // non-reloading hash update
  const updateBrowserHash = useHashNavigator();

  const urlManager = useMemo(() => new ViewerURLManager(), []);

  // generic callback
  const updateHash = useCallback(
    (name: string, v: Partial<ViewerLocation>) => {
      urlManager.updateViewer(name, v);
      const u = urlManager.asFullHashURL();
      // console.debug(`Updated # for ${name} => ${u}`);
      updateBrowserHash(u);
    },
    [updateBrowserHash, urlManager],
  );

  // callbacks for springs to update url when animation stops
  const updateM = (v: Partial<ViewerLocation>) => updateHash('m', v);
  const updateJ = (v: Partial<ViewerLocation>) => updateHash('j', v);

  const mandelbrotControls: ViewerControlSprings = {
    xyCtrl: useSpring<ViewerXYControl>(() => ({
      xy: viewerOrigin.xy,
      config: springsConfigs.default.xy,
      onRest: updateM,
    })),

    zoomCtrl: useSpring<ViewerZoomControl>(() => ({
      z: viewerOrigin.z,
      minZoom: 0.5,
      maxZoom: 100000,
      config: springsConfigs.default.zoom,
      onRest: updateM,
    })),

    rotCtrl: useSpring<ViewerRotationControl>(() => ({
      theta: viewerOrigin.theta, // all angles in rad
      config: springsConfigs.default.rot,
      onRest: updateM,
    })),
  };

  const juliaControls: ViewerControlSprings = {
    xyCtrl: useSpring<ViewerXYControl>(() => ({
      xy: viewerOrigin.xy,
      config: springsConfigs.default.xy,
      onRest: updateJ,
    })),

    zoomCtrl: useSpring<ViewerZoomControl>(() => ({
      z: viewerOrigin.z,
      minZoom: 0.5,
      maxZoom: 2000,
      config: springsConfigs.default.zoom,
      onRest: updateJ,
    })),

    rotCtrl: useSpring<ViewerRotationControl>(() => ({
      theta: viewerOrigin.theta, // all angles in rad
      config: springsConfigs.default.rot,
      onRest: updateJ,
    })),
  };

  useEffect(() => {
    // viewer should update if user goes back / forward on the page
    // parse current location after user change
    urlManager.updateFromURL();
    console.log(`Warping to requested url => ${currentLocation()}`);

    // warp to the newly parsed locations
    warpToPoint(mandelbrotControls, urlManager.vs['m'].v);
    warpToPoint(juliaControls, urlManager.vs['j'].v);
    // this update process should only trigger when the hash location changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc]);

  const reset = () => {
    warpToPoint(mandelbrotControls, viewerOrigin);
    warpToPoint(juliaControls, viewerOrigin);
  };

  const [showInfo, setShowInfo] = useState(false);

  const toggleInfo = () => setShowInfo(!showInfo);

  return (
    <ThemeProvider theme={theme}>
      <ServiceWorkerWrapper />
      <SettingsProvider>
        <Grid container>
          <SettingsContext.Consumer>
            {({ settings }) => (
              // JSX expressions must have one parent element
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
                <CoordinateInterface
                  show={settings.showCoordinates}
                  mandelbrot={mandelbrotControls}
                />
                <OrbitPlotter
                  show={settings.showOrbit}
                  mandelbrot={mandelbrotControls}
                  rendererWidth={
                    (size.width || 1) < (size.height || 0)
                      ? size.width || 1
                      : (size.width || 1) / 2
                  }
                  rendererHeight={
                    (size.width || 1) < (size.height || 0)
                      ? (size.height || 0) / 2
                      : size.height || 0
                  }
                />
                <Grid item xs className="renderer">
                  <MandelbrotRenderer controls={mandelbrotControls} {...settings} />
                </Grid>
                <Grid item xs className="renderer">
                  <JuliaRenderer
                    c={mandelbrotControls.xyCtrl[0].xy}
                    controls={juliaControls}
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
