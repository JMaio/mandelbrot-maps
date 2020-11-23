import { Grid, ThemeProvider } from '@material-ui/core';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { OpaqueInterpolation, useSpring } from 'react-spring';
import { vScale } from 'vec-la-fp';
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
  XYType,
  ZoomType,
} from './common/types';
import { useWindowSize, warpToPoint } from './common/utils';
import {
  defaultJuliaStart,
  defaultMandelbrotStart,
  screenScaleMultiplier,
  springsConfigs,
  viewerOrigin,
} from './common/values';
import ChangeCoordinatesCard from './components/info/ChangeCoordinatesCard';
import CoordinatesCard from './components/info/CoordinatesCard';
import InfoDialog from './components/info/InfoDialog';
import JuliaRenderer from './components/render/JuliaRenderer';
// import 'typeface-roboto';
import MandelbrotRenderer from './components/render/MandelbrotRenderer';
import ServiceWorkerWrapper from './components/ServiceWorkerWrapper';
import SettingsProvider, { SettingsContext } from './components/settings/SettingsContext';
import SettingsMenu from './components/settings/SettingsMenu';
import theme from './theme/theme';

function App(): JSX.Element {
  const size = useWindowSize();

  // if app is started with a hash location, assume
  // it should be the starting position
  // // detects hash updates
  const [loc, navigate] = useHashLocation();

  // non-reloading hash update
  const updateBrowserHash = useHashNavigator();

  const urlManager = useMemo(() => {
    // console.log('new url manager');
    return new ViewerURLManager();
  }, []);

  const updateHash = useCallback(
    (name: string, v: Partial<ViewerLocation>) => {
      urlManager.updateViewer(name, v);
      const u = urlManager.asFullHashURL();
      console.log(`# => ${u}`);
      updateBrowserHash(u);
    },
    [updateBrowserHash, urlManager],
  );

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

  // const warpM = (v: Partial<ViewerLocation>, immediate = false) =>
  //   warpToPoint(mandelbrotControls, v, immediate);
  // const warpJ = (v: Partial<ViewerLocation>, immediate = false) =>
  //   warpToPoint(juliaControls, v, immediate);

  useEffect(() => {
    console.log('warp to requested url');
    const l = currentLocation();
    console.log(l);
    navigate(l);
    warpToPoint(mandelbrotControls, urlManager.vs['m'].v);
    warpToPoint(juliaControls, urlManager.vs['j'].v);
    // disabling empty dependency array check: this effect should
    // only run once, when the page is initially navigated to
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc]);

  // useEffect(() => {
  //   warpToPoint
  // }, [loc])
  //// should update if user goes back / forward on the page?
  // useEffect(() => {
  //   warpToPoint(mandelbrotControls, urlManager.vs['m'].v);
  //   warpToPoint(juliaControls, urlManager.vs['j'].v);
  // }, [loc]);

  const reset = () => {
    warpToPoint(mandelbrotControls, viewerOrigin);
    warpToPoint(juliaControls, viewerOrigin);
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
                    zIndex: 1,
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
                  />
                  <ChangeCoordinatesCard
                    show={settings.showCoordinates}
                    mandelbrot={mandelbrotControls}
                  />
                </div>
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
