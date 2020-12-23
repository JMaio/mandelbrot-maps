import { RgbColor } from 'react-colorful';
import { ViewerLocation } from './types';

// this multiplier subdivides the screen space into smaller increments
// to allow for velocity calculations to not immediately decay, due to the
// otherwise small scale that is being mapped to the screen.
// export const screenScaleMultiplier = 1e-7;
// TL;DR this was a workaround - react-spring allows for "precision"
//       to be defined in each spring configuration, which is:
//       > The smallest velocity before the animation is considered "not moving"
export const defaultPrecision = 1e-7;

export const viewerOrigin: ViewerLocation = {
  xy: [0, 0],
  z: 1,
  theta: 0,
};

export const defaultMandelbrotStart: ViewerLocation = {
  xy: [0.2361652, 0.5633767],
  z: 4,
  theta: 0.2,
};
export const defaultJuliaStart: ViewerLocation = {
  xy: [0.4364131, -0.6468786],
  z: 4,
  theta: 2.12,
};
// indexable viewer start object
export const defaultViewerStart: { [k: string]: ViewerLocation } = {
  m: defaultMandelbrotStart,
  j: defaultJuliaStart,
};

export const springsConfigs = {
  /** used when the values are animated to a point, includes decay */
  default: {
    xy: { mass: 1, tension: 500, friction: 75, precision: defaultPrecision },
    zoom: { mass: 1, tension: 300, friction: 40 },
    rot: { mass: 1, tension: 400, friction: 75 },
  },
  /** used when a user is interacting with the view */
  user: {
    xy: { mass: 1, tension: 2000, friction: 75, precision: defaultPrecision },
    zoom: { mass: 1, tension: 1200, friction: 75 },
    rot: { mass: 1, tension: 1200, friction: 75 },
  },
  // default and decay are merged to give them single "non-user" values
  // decay: {
  //   /** used after the user has let go of the view, decaying */
  //   xy: { mass: 1, tension: 500, friction: 75 },
  //   zoom: { mass: 1, tension: 300, friction: 50 },
  //   rot: { mass: 1, tension: 400, friction: 75 },
  // },
};

export const defaultShadingColour: RgbColor = { r: 0, g: 180, b: 255 };

// export const defaultSpringConfig = { mass: 1, tension: 100, friction: 200 };

// export const xyCtrlSpringConfig = { mass: 1, tension: 2000, friction: 100 };
// export const xyCtrlSpringDecayConfig = { mass: 1, tension: 500, friction: 75 };

// default number of numbers after the decimal point
export const defaultFloatFixedPrecision = 7;
export const shortFloatFixedPrecision = 2;

export const toFloatDisplay = (n: number, p: number): number => +n.toFixed(p);

export const toFloatDisplayDefault = (n: number): number =>
  toFloatDisplay(n, defaultFloatFixedPrecision);

export const toFloatDisplayShort = (n: number): number =>
  toFloatDisplay(n, shortFloatFixedPrecision);
