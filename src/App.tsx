import { Grid } from '@material-ui/core';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSpring } from 'react-spring';
import './App.css';
import {
  currentLocation,
  useHashLocation,
  useHashNavigator,
  ViewerURLManager,
} from './common/routing';
import { settingsDefinitionsType } from './common/settings';
import {
  SpringAnimatedValueWithSetter,
  SpringControl,
  springControlKeys,
  ViewerControlSprings,
  ViewerLocation,
  ViewerRotationControl,
  ViewerXYControl,
  ViewerZoomControl,
} from './common/types';
import { useWindowSize, warpToPoint } from './common/utils';
import {
  deepZoomPrecision,
  defaultPrecision,
  PrecisionFormatter,
  springsConfigs,
  viewerOrigin,
} from './common/values';
import CoordinateInterface from './components/info/CoordinateInterface';
import FirstTimeInfo from './components/info/FirstTimeInfo';
import InfoDialog from './components/info/InfoDialog';
import JuliaRenderer from './components/render/JuliaRenderer';
// import 'typeface-roboto';
import MandelbrotRenderer from './components/render/MandelbrotRenderer';
import MandelbrotRendererDeep from './components/render/MandelbrotRendererDeep';
import ViewChanger from './components/render/ViewChanger';
import SettingsMenu from './components/settings/SettingsMenu';

function App({ settings }: { settings: settingsDefinitionsType }): JSX.Element {
  const size = useWindowSize();
  const vertical = size.w < size.h;

  const DPR = window.devicePixelRatio;
  const currentDPR = settings.useDPR ? DPR : 1;

  // set application float precision based on whether deep zoom is enabled
  const [precision, setPrecision] = useState(defaultPrecision);
  const precisionFormatter = PrecisionFormatter(precision);

  // update the new precision
  useEffect(() => {
    setPrecision(settings.deepZoom ? deepZoomPrecision : defaultPrecision);
  }, [settings.deepZoom]);

  // if app is started with a hash location, assume
  // it should be the starting position
  // detects hash updates
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loc, navigate] = useHashLocation();

  // non-reloading hash update
  const updateBrowserHash = useHashNavigator();

  // why is this a memo?
  // does making it a memo mean it won't slow down initial rendering?
  const urlManager = useMemo(() => new ViewerURLManager(), []);

  /**
   * generic callback.
   * called when the viewer has moved and the hash url needs to be updated
   */
  const updateHash = useCallback(
    (name: string, v: Partial<ViewerLocation>) => {
      // console.log('deepzoom:', settings.deepZoom);
      urlManager.updateViewer(name, v, precisionFormatter);
      const u = urlManager.asFullHashURL();
      // console.debug(`Updated # for ${name} => ${u}`);
      updateBrowserHash(u);
    },
    [precisionFormatter, updateBrowserHash, urlManager],
  );

  // The 'updateM' function makes the dependencies of useEffect Hook (at line 127) change on
  // every render. To fix this, wrap the definition of 'updateM' in its own useCallback() Hook
  // callbacks for springs to update url when animation stops
  const updateM = useCallback((v: Partial<ViewerLocation>) => updateHash('m', v), [
    updateHash,
  ]);
  const updateJ = useCallback((v: Partial<ViewerLocation>) => updateHash('j', v), [
    updateHash,
  ]);

  const mandelbrotControls: ViewerControlSprings = {
    xyCtrl: useSpring<ViewerXYControl>(() => ({
      xy: viewerOrigin.xy,
      config: springsConfigs(precision).default.xyCtrl,
      onRest: updateM,
    })),

    zoomCtrl: useSpring<ViewerZoomControl>(() => ({
      z: viewerOrigin.z,
      minZoom: 0.5,
      // Numeric literals with absolute values equal to 2^53 or greater are too large
      // to be represented accurately as integers. [ts(80008)]
      maxZoom: 1e16,
      // 100_000_000_000_000_000,
      config: springsConfigs(precision).default.zoomCtrl,
      onRest: updateM,
    })),

    rotCtrl: useSpring<ViewerRotationControl>(() => ({
      theta: viewerOrigin.theta, // all angles in rad
      config: springsConfigs(precision).default.rotCtrl,
      onRest: updateM,
    })),
  };

  // make sure that the spring "onRest" is updated if the precision changes
  useEffect(() => {
    Object.entries(mandelbrotControls).forEach(
      ([k, [, set]]: [string, SpringAnimatedValueWithSetter<SpringControl>]) => {
        try {
          const key = k as springControlKeys;
          set({
            onRest: updateM,
            // hacky way to grab the config
            config: springsConfigs(precision).default[key],
          });
        } catch (error) {
          // guess not
        }
      },
    );
    // explicitly not adding mandelbrotControls to the deps list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [precision, updateM]);

  const juliaControls: ViewerControlSprings = {
    xyCtrl: useSpring<ViewerXYControl>(() => ({
      xy: viewerOrigin.xy,
      config: springsConfigs(precision).default.xyCtrl,
      onRest: updateJ,
    })),

    zoomCtrl: useSpring<ViewerZoomControl>(() => ({
      z: viewerOrigin.z,
      minZoom: 0.5,
      maxZoom: 2000,
      config: springsConfigs(precision).default.zoomCtrl,
      onRest: updateJ,
    })),

    rotCtrl: useSpring<ViewerRotationControl>(() => ({
      theta: viewerOrigin.theta, // all angles in rad
      config: springsConfigs(precision).default.rotCtrl,
      onRest: updateJ,
    })),
  };

  useEffect(() => {
    // viewer should update if user goes back / forward on the page
    // parse current location after user change
    urlManager.updateFromURL();
    console.log(`Warping to requested url => ${currentLocation()}`);

    // warp to the newly parsed locations
    warpToPoint(mandelbrotControls, urlManager.vs['m'].v, precision);
    warpToPoint(juliaControls, urlManager.vs['j'].v, precision);
    // this update process should only trigger when the hash location changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc]);

  const reset = () => {
    warpToPoint(mandelbrotControls, viewerOrigin, precision);
    warpToPoint(juliaControls, viewerOrigin, precision);
  };

  const [showInfo, setShowInfo] = useState(false);
  const toggleInfo = () => setShowInfo((i) => !i);

  const [openHelp, setOpenHelp] = useState(false);
  const toggleHelp = () => setOpenHelp((i) => !i);

  // [showMandelbrot, showJulia]
  const [[showMandelbrot, showJulia], setViewerState] = useState<[boolean, boolean]>([
    true,
    true,
  ]);

  return (
    <>
      <Grid container>
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
            precision={precision}
            precisionFormatter={precisionFormatter}
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
            {settings.deepZoom ? (
              <MandelbrotRendererDeep
                controls={mandelbrotControls}
                DPR={currentDPR}
                precision={precision}
                {...settings}
              />
            ) : (
              <MandelbrotRenderer
                controls={mandelbrotControls}
                DPR={currentDPR}
                precision={precision}
                {...settings}
              />
            )}
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
              precision={precision}
              {...settings}
            />
          </Grid>

          {/* Settings menu uses SettingsContext so must be within provider */}
          <SettingsMenu
            reset={reset}
            toggleInfo={toggleInfo}
            helpState={[openHelp, toggleHelp]}
          />
        </Grid>
        );
      </Grid>
      <InfoDialog ctrl={[showInfo, setShowInfo]} />

      {/* FirstTimeInfo requires access to settings */}
      <FirstTimeInfo ctrl={[openHelp, toggleHelp]} />
    </>
  );
}

export default App;
