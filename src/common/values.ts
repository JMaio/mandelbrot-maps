import { ViewerLocation } from './types';

export const startPos: [number, number] = [-0.7746931, 0.1242266];
export const startZoom = 85.0;
export const startTheta = 0.6;

// this multiplier subdivides the screen space into smaller increments
// to allow for velocity calculations to not immediately decay, due to the
// otherwise small scale that is being mapped to the screen.
export const screenScaleMultiplier = 1e-6;

export const viewerOrigin: ViewerLocation = {
  xy: [0, 0],
  z: 1,
  theta: 0,
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
    zoom: { mass: 1, tension: 700, friction: 60 },
    rot: { mass: 1, tension: 400, friction: 75 },
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
