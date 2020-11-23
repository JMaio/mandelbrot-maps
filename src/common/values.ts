import { ViewerLocation } from './types';

// this multiplier subdivides the screen space into smaller increments
// to allow for velocity calculations to not immediately decay, due to the
// otherwise small scale that is being mapped to the screen.
export const screenScaleMultiplier = 1e-6;

export const viewerOrigin: ViewerLocation = {
  xy: [0, 0],
  z: 1,
  theta: 0,
};
export const defaultMandelbrotStart: ViewerLocation = {
  xy: [0.2361652, 0.5633767],
  z: 7,
  theta: 0.2,
};
export const defaultJuliaStart: ViewerLocation = {
  xy: [0.4364131, -0.6468786],
  z: 3.78,
  theta: 2.12,
};

export const springsConfigs = {
  default: {
    /** used when the values are animated to a point, includes decay */
    xy: { mass: 1, tension: 500, friction: 75 },
    zoom: { mass: 1, tension: 300, friction: 40 },
    rot: { mass: 1, tension: 400, friction: 75 },
  },
  user: {
    /** used when a user is interacting with the view */
    xy: { mass: 1, tension: 2000, friction: 75 },
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
