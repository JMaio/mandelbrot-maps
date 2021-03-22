import { Grid, IconButton } from '@material-ui/core';
import React, {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
  XYType,
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
import AnimationFinalCard, {
  AnimationStatus,
} from './components/tans_theorem/AnimationFinalCard';
import JuliaRenderer from './components/render/JuliaRenderer';
// import 'typeface-roboto';
import MandelbrotRenderer from './components/render/MandelbrotRenderer';
import MandelbrotRendererDeep from './components/render/MandelbrotRendererDeep';
import ViewChanger from './components/render/ViewChanger';
import SettingsMenu from './components/settings/SettingsMenu';
import {
  alignSets,
  findNearestMisiurewiczPoint,
  NearestButton,
  PreperiodicPoint,
  similarPoints,
} from './components/tans_theorem/tansTheoremUtils';
import SimilarityMenu from './components/tans_theorem/SimilarityMenu';
import SimilarityAnimationCard from './components/tans_theorem/SimilarityAnimationCard';
import MisiurewiczDomainsMenu from './components/tans_theorem/MisiurewiczDomainsMenu';
import PointsInfoCard from './components/tans_theorem/MisiurewiczPointsMenu';
import ArrowBackwardIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';
import MisiurewiczMarkersManager from './components/tans_theorem/MisiurewiczMarkersManager';
import JuliaMarkersManager from './components/tans_theorem/JuliaMarkersManager';
import ZoomMenu from './components/tans_theorem/ZoomMenu';
import PlayCard from './components/tans_theorem/PlayCard';
import IntroCard from './components/tans_theorem/IntroCard';

const defaultP: XYType = [-0.10109636384562218, +0.9562865108091414];
const defaultMisiurewiczPoint = new PreperiodicPoint(defaultP, defaultP, false);

const normaliseZoom = (z: number, point: PreperiodicPoint) => {
  return z / point.factorMagnitude;
};

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void | null>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  });

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (typeof savedCallback?.current !== 'undefined') {
        savedCallback?.current();
      }
    }

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

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

  const [showTan, setShowTan] = useState(false);
  const toggleTan = () => {
    setShowTan(true);
    warpToPoint(mandelbrotControls, {
      xy: [0, 0],
      z: 0.5,
      theta: 0,
    });
    warpToPoint(juliaControls, {
      xy: [0, 0],
      z: 0.5,
      theta: 0,
    });
  };
  const handleQuit = () => setShowTan(false);

  // [showMandelbrot, showJulia]
  const [[showMandelbrot, showJulia], setViewerState] = useState<[boolean, boolean]>([
    true,
    true,
  ]);

  // const { settings } = useSettings();

  const [animationState, setAnimationState] = React.useState(AnimationStatus.INTRO);
  const [magnification, setMagnification] = React.useState<number>(1);
  const [focusedPointMandelbrot, setFocusedPointMandelbrot] = useState(
    defaultMisiurewiczPoint,
  );
  const [similarPointsJulia, setSimilarPointsJulia] = useState(
    similarPoints(defaultMisiurewiczPoint, 4).sort(
      (a, b) => a.factorMagnitude - b.factorMagnitude,
    ),
  );
  const [focusedPointJulia, setFocusedPointJulia] = useState(similarPointsJulia[0]);

  const [aspectRatio, setAspectRatio] = useState(1);
  const rendererRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  const align = (z: number) => {
    setMagnification(z);
    alignSets(
      z,
      mandelbrotControls,
      juliaControls,
      focusedPointMandelbrot,
      focusedPointJulia,
      settings.rotateWhileZooming,
    );
  };
  const alignM = (z: number) => {
    const newMag = normaliseZoom(z, focusedPointJulia);
    align(newMag);
  };

  const alignJ = (z: number) => {
    const newMag = normaliseZoom(z, focusedPointMandelbrot);
    align(newMag);
  };

  const handleMisiurewiczPointSelection = useCallback(
    (pointM: PreperiodicPoint): void => {
      const similars = similarPoints(pointM, 4).sort(
        (a, b) => a.factorMagnitude - b.factorMagnitude,
      );
      if (similars.length > 0) {
        setFocusedPointMandelbrot(pointM);
        setFocusedPointJulia(similars[0]);
        setSimilarPointsJulia(similars);
      }
    },
    [],
  );

  const handleSimilarPointSelection = useCallback(
    (pointJ: PreperiodicPoint): void => {
      setFocusedPointJulia(pointJ);
    },
    [setFocusedPointJulia],
  );

  const handleReset = () => {
    setAnimationState(AnimationStatus.SELECT_MANDELBROT_POINT);
    setMagnification(1);
    warpToPoint(mandelbrotControls, {
      xy: focusedPointMandelbrot.point,
      z: focusedPointMandelbrot.factorMagnitude,
      theta: 0,
    });
    warpToPoint(juliaControls, {
      xy: [0, 0],
      z: 0.5,
      theta: 0,
    });
  };

  const updateAspectRatio = () => {
    if (showTan && rendererRef.current)
      setAspectRatio(rendererRef.current.offsetHeight / rendererRef.current.offsetWidth);
  };
  useInterval(updateAspectRatio, 1000);

  const BackButton = () => (
    <IconButton style={{ width: 50 }} onClick={handleReset}>
      <ArrowBackwardIcon />
    </IconButton>
  );
  const QuitButton = () => (
    <IconButton style={{ width: 50 }} onClick={handleQuit}>
      <CloseIcon />
    </IconButton>
  );

  const handleNearest = (xy: XYType) => {
    const mPoint = findNearestMisiurewiczPoint(xy, 10000);
    if (mPoint[0] !== 0 && mPoint[1] !== 0) {
      const p = new PreperiodicPoint(mPoint, mPoint, false);
      handleMisiurewiczPointSelection(p);
    }
  };

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
          <div
            style={{
              zIndex: 1300,
              position: 'absolute',
              left: 0,
              top: 0,
              pointerEvents: 'none',
            }}
          >
            {showTan ? (
              <div
                style={{
                  pointerEvents: 'all',
                }}
              >
                {animationState === AnimationStatus.INTRO ? (
                  <IntroCard
                    show={true}
                    mandelbrot={mandelbrotControls}
                    julia={juliaControls}
                    animationState={animationState}
                    setAnimationState={setAnimationState}
                    focusedPointMandelbrot={focusedPointMandelbrot}
                    focusedPointJulia={focusedPointJulia}
                    handleMandelbrotSelection={handleMisiurewiczPointSelection}
                    quitButton={QuitButton}
                  />
                ) : null}
                {animationState === AnimationStatus.SELECT_MANDELBROT_POINT ? (
                  settings.shadeMisiurewiczDomains ? (
                    <MisiurewiczDomainsMenu
                      show={true}
                      mandelbrot={mandelbrotControls}
                      julia={juliaControls}
                      setAnimationState={setAnimationState}
                      focusedPointMandelbrot={focusedPointMandelbrot}
                      focusedPointJulia={focusedPointJulia}
                      quitButton={QuitButton}
                    />
                  ) : (
                    <PointsInfoCard
                      show={true}
                      mandelbrot={mandelbrotControls}
                      julia={juliaControls}
                      animationState={animationState}
                      setAnimationState={setAnimationState}
                      focusedPointMandelbrot={focusedPointMandelbrot}
                      focusedPointJulia={focusedPointJulia}
                      handleMandelbrotSelection={handleMisiurewiczPointSelection}
                      quitButton={QuitButton}
                    />
                  )
                ) : null}
                <AnimationFinalCard
                  animationState={animationState}
                  handleReset={handleReset}
                />
                {animationState === AnimationStatus.SELECT_JULIA_POINT ? (
                  <SimilarityMenu
                    show={showTan}
                    julia={juliaControls}
                    setAnimationState={setAnimationState}
                    focusedPointMandelbrot={focusedPointMandelbrot}
                    focusedPointJulia={focusedPointJulia}
                    similarPointsJulia={similarPointsJulia}
                    handleSimilarPointSelection={handleSimilarPointSelection}
                    backButton={BackButton}
                  />
                ) : null}
                {[
                  AnimationStatus.ZOOM_M,
                  AnimationStatus.ZOOM_J,
                  AnimationStatus.ROTATE_M,
                  AnimationStatus.ROTATE_J,
                ].includes(animationState) ? (
                  <ZoomMenu
                    backButton={BackButton}
                    show={true}
                    mandelbrot={mandelbrotControls}
                    julia={juliaControls}
                    animationState={animationState}
                    setAnimationState={setAnimationState}
                    focusedPointMandelbrot={focusedPointMandelbrot}
                    focusedPointJulia={focusedPointJulia}
                  />
                ) : null}
              </div>
            ) : null}
            {showTan &&
            settings.rotateWhileZooming &&
            animationState === AnimationStatus.PLAY ? (
              <PlayCard
                focusedPointMandelbrot={focusedPointMandelbrot}
                magnification={magnification}
              />
            ) : null}
          </div>
          <SimilarityAnimationCard
            show={
              showTan &&
              [
                AnimationStatus.INTRO,
                AnimationStatus.SELECT_MANDELBROT_POINT,
                AnimationStatus.SELECT_JULIA_POINT,
                AnimationStatus.ZOOM_M,
                AnimationStatus.ZOOM_J,
                AnimationStatus.ROTATE_M,
                AnimationStatus.ROTATE_J,
              ].includes(animationState)
            }
            animationState={animationState}
            focusedPoint={focusedPointMandelbrot}
            focusedPointJulia={focusedPointJulia}
          />
          <Grid
            item
            xs
            className="renderer"
            style={{
              // flex-grow takes up more space in a ratio format
              flexGrow: showMandelbrot ? 1 : 0, // percentFlex.m.interpolate((x) => x),
              position: 'relative',
            }}
            ref={rendererRef}
          >
            <MisiurewiczMarkersManager
              show={showTan && animationState === AnimationStatus.SELECT_MANDELBROT_POINT}
              viewerControls={mandelbrotControls}
              shadeMisiurewiczDomains={settings.shadeMisiurewiczDomains}
              magnification={magnification}
              focusedPoint={focusedPointMandelbrot}
              setter={handleMisiurewiczPointSelection}
              aspectRatio={aspectRatio}
            />
            {showTan &&
            settings.shadeMisiurewiczDomains &&
            animationState === AnimationStatus.SELECT_MANDELBROT_POINT
              ? NearestButton(handleNearest, mandelbrotControls.xyCtrl[0].xy.getValue())
              : null}
            {settings.deepZoom ? (
              <MandelbrotRendererDeep
                animationState={animationState}
                align={alignJ}
                controls={mandelbrotControls}
                DPR={currentDPR}
                precision={precision}
                showTan={showTan}
                {...settings}
              />
            ) : (
              <MandelbrotRenderer
                animationState={animationState}
                align={alignJ}
                controls={mandelbrotControls}
                DPR={currentDPR}
                precision={precision}
                showTan={showTan}
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
              position: 'relative',
            }}
          >
            <JuliaMarkersManager
              show={showTan && animationState === AnimationStatus.SELECT_JULIA_POINT}
              viewerControls={juliaControls}
              magnification={magnification}
              focusedPoint={focusedPointJulia}
              setter={handleSimilarPointSelection}
              aspectRatio={aspectRatio}
              similarPointsJulia={similarPointsJulia}
            />
            <JuliaRenderer
              animationState={animationState}
              align={alignM}
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
            toggleTan={toggleTan}
            helpState={[openHelp, toggleHelp]}
          />
        </Grid>
      </Grid>
      <InfoDialog ctrl={[showInfo, setShowInfo]} />

      {/* FirstTimeInfo requires access to settings */}
      <FirstTimeInfo ctrl={[openHelp, toggleHelp]} />
    </>
  );
}

export default App;
