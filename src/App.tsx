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
import FirstTimeInfo from './components/info/FirstTimeInfo';
import InfoDialog from './components/info/InfoDialog';
import JuliaRenderer from './components/render/JuliaRenderer';
// import 'typeface-roboto';
import MandelbrotRenderer from './components/render/MandelbrotRenderer';
import ViewChanger from './components/render/ViewChanger';
import ServiceWorkerWrapper from './components/ServiceWorkerWrapper';
import SettingsProvider, { SettingsContext } from './components/settings/SettingsContext';
import SettingsMenu from './components/settings/SettingsMenu';
import theme from './theme/theme';

function App(): JSX.Element {
  const size = useWindowSize();
  const DPR = window.devicePixelRatio;

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
  const toggleInfo = () => setShowInfo((i) => !i);

  const [openHelp, setOpenHelp] = useState(false);
  const showHelp = () => setOpenHelp((i) => !i);

  // [showMandelbrot, showJulia]
  const [[showMandelbrot, showJulia], setViewerState] = useState<[boolean, boolean]>([
    true,
    true,
  ]);
  // const [showMandelbrot, setShowMandelbrot] = useState(true);
  // const [showJulia, setShowJulia] = useState(true);
  // const [showMandelbrot, showJulia] = viewerState;

  // Wrap the Typography component with animated first
  // const AnimatedTypography = animated(Typography)
  // <AnimatedTypography></AnimatedTypography>
  // const AnimatedGrid = animated(Grid);

  return (
    <ThemeProvider theme={theme}>
      <ServiceWorkerWrapper />
      <SettingsProvider>
        <Grid container>
          <SettingsContext.Consumer>
            {({ settings }) => {
              const currentDPR = settings.useDPR ? DPR : 1;
              const vertical = size.w < size.h;
              return (
                // JSX expressions must have one parent element
                <Grid
                  item
                  container
                  direction={vertical ? 'column-reverse' : 'row'}
                  alignItems={vertical ? 'flex-end' : 'flex-start'}
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
                  <Grid
                    item
                    xs
                    className="renderer"
                    style={{
                      // flex-grow takes up more space in a ratio format
                      flexGrow: showMandelbrot ? 1 : 0, // percentFlex.m.interpolate((x) => x),
                    }}
                  >
                    <MandelbrotRenderer
                      controls={mandelbrotControls}
                      DPR={currentDPR}
                      {...settings}
                    />
                  </Grid>

                  <Grid item style={{ width: 0, height: 0, zIndex: 1 }}>
                    <ViewChanger vertical={vertical} changeFunc={setViewerState} />
                  </Grid>

                  <Grid
                    item
                    xs
                    className="renderer"
                    style={{
                      // flex-grow takes up more space in a ratio format
                      flexGrow: showJulia ? 1 : 0, // percentFlex.j.interpolate((x) => x),
                    }}
                  >
                    <JuliaRenderer
                      c={mandelbrotControls.xyCtrl[0].xy}
                      controls={juliaControls}
                      DPR={currentDPR}
                      {...settings}
                    />
                  </Grid>

                  {/* Settings menu uses SettingsContext so must be within provider */}
                  <SettingsMenu
                    reset={reset}
                    toggleInfo={toggleInfo}
                    showHelp={showHelp}
                  />
                </Grid>
              );
            }}
          </SettingsContext.Consumer>
        </Grid>
      </SettingsProvider>

      <InfoDialog ctrl={[showInfo, setShowInfo]} />

      <FirstTimeInfo ctrl={[openHelp, setOpenHelp]} />
    </ThemeProvider>
  );
}

export default App;
