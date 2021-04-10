import { ViewerControlSprings, XYType } from '../../common/types';

export const MAX_DEPTH = 4;

const MAX_PREPERIOD = 30;

const equal = (a: XYType, b: XYType, tolerance = 1e-10): boolean => {
  const d = sub(a, b);
  const dx: number = Math.abs(d[0]);
  const dy: number = Math.abs(d[1]);
  return dx < tolerance && dy < tolerance;
};

const add = (a: XYType, b: XYType): XYType => [a[0] + b[0], a[1] + b[1]];
const sub = (a: XYType, b: XYType): XYType => [a[0] - b[0], a[1] - b[1]];
const magnitude = (c: XYType): number => Math.sqrt(c[0] * c[0] + c[1] * c[1]);

const mult = (a: XYType, b: XYType): XYType => [
  a[0] * b[0] - a[1] * b[1],
  a[0] * b[1] + a[1] * b[0],
];

const divide = (x: XYType, y: XYType): XYType => {
  const d = y[0] * y[0] + y[1] * y[1];
  return [(x[0] * y[0] + x[1] * y[1]) / d, (x[1] * y[0] - x[0] * y[1]) / d];
};

const square = (c: XYType): XYType => [
  Math.pow(c[0], 2) - Math.pow(c[1], 2),
  2.0 * c[0] * c[1],
];

const sqrt = (c: XYType): XYType => {
  const theta = Math.atan2(c[1], c[0]);
  const r2 = Math.sqrt(magnitude(c));
  return mult([r2, 0], [Math.cos(theta / 2), Math.sin(theta / 2)]);
};

const orbit = (z: XYType, c: XYType, n: number): XYType => {
  for (let i = 0; i < n; i++) {
    z = add(square(z), c);
  }
  return z;
};

const recursiveDerivative = (z: XYType, c: XYType, t: number): XYType => {
  let der: XYType = [1, 0];
  for (let i = 0; i < t; i++) {
    der = mult([2, 0], mult(der, z));
    z = add(square(z), c);
  }

  return der;
};

const cycleEigenvalue = (c: XYType, l: number, p: number): XYType =>
  recursiveDerivative(orbit(c, c, l), c, p);

const magnificationRotationJulia = (c: XYType, z: XYType): XYType => {
  const x = forwardOrbit([0, 0], c, 50);
  const alpha = x[0][x[1]];
  let der: XYType = [1, 0];
  for (let i = 0; i < 100; i++) {
    der = mult([2, 0], mult(der, z));
    z = add(square(z), c);
    if (equal(alpha, z, 0.0001)) return der;
  }

  return [0, 0];
};

/**
 * Subtract the first iterate in a cycle from the last.
 *
 * @param c - The point we care about. Must be periodic or preperiodic
 * @param z - The preperiod of c
 * @param l - The period of c
 * @returns The derivative of W at c
 */
const W = (c: XYType, l: number, p: number) => {
  const startOfCycle = orbit(c, c, l);
  const endOfCycle = orbit(startOfCycle, c, p);

  return sub(endOfCycle, startOfCycle);
};

const Wderivative = (c: XYType, l: number, p: number) => {
  const startOfCycle = recursiveDerivative(c, c, l);
  const endOfCycle = recursiveDerivative(c, c, l + p);

  return sub(endOfCycle, startOfCycle);
};

/**
 * Finds the numerical derivative of a function.
 *
 * @param c - The point we are taking the derivative of
 * @returns The derivative of f at c
 */
const numericalDerivative = (c: XYType, f: (c: XYType) => XYType): XYType => {
  const epsilon = 1e-9;
  const withoutH = f(c);
  const withH = f(add(c, [epsilon, 0]));

  return [sub(withH, withoutH)[0] / epsilon, sub(withH, withoutH)[1] / epsilon];
};

/**
 *
 * @param c - The point at the centre of the branch
 * @param l - The preperiod of c
 * @param p - The period of z
 * @returns The size of the branch
 */
const magnificationRotationMandelbrot = (c: XYType, l: number, p: number): XYType => {
  const firstIterateInCycle: XYType = orbit(c, c, l);
  const cycleEigenvalue: XYType = recursiveDerivative(firstIterateInCycle, c, p);

  return divide(
    numericalDerivative(c, (x: XYType) => W(x, l, p)),
    sub(cycleEigenvalue, [1, 0]),
  );
};

export const round = (value: number, precision = 0): number => {
  const multiplier = Math.pow(10, precision);
  return Math.round(value * multiplier) / multiplier;
};

export const formatComplexNumber = (c: XYType, precision = 3): string =>
  `${round(c[0], precision)}${c[1] >= 0 ? '+' : ''}${round(c[1], precision)}i`;

export const formatAngle = (angle: number): string =>
  `${round((180 / Math.PI) * angle, 0)}°`;

const findPotentialPreperiod = (c: XYType): number => {
  let minDistance = 999999999;
  let minPreperiod = 0;
  let z: XYType = [0, 0];
  for (let i = 0; i < MAX_PREPERIOD; i++) {
    const z0 = z;
    z = add(square(z), c);

    const a = z[0] - z0[0];
    const b = z[1] - z0[1];
    const distance = Math.sqrt(a * a + b * b);
    if (i > 0 && distance < minDistance) {
      minPreperiod = i;
      minDistance = distance;
    }
  }
  return minPreperiod;
};

export const findNearestMisiurewiczPoint = (c: XYType, iterations: number): XYType => {
  const q = findPotentialPreperiod(c);
  if (q === 0) {
    return [0, 0];
  }
  const p = 1;
  const learningRate: XYType = [0.01, 0];
  for (let i = 0; i < iterations; i++) {
    const F = W(c, q, p);
    const Fdash = Wderivative(c, q, p);
    c = sub(c, mult(learningRate, divide(F, Fdash)));
  }
  return c;
};

const depthFirstSearch = (z: XYType, c: XYType, zs: XYType[], depth: number) => {
  zs.push(z);
  if (!equal(z, c, 0.00001) && depth > 0) {
    const positivePreimage = sqrt(sub(z, c));
    const negativePreimage = mult([-1, 0], positivePreimage);
    depthFirstSearch(positivePreimage, c, zs, depth - 1);
    depthFirstSearch(negativePreimage, c, zs, depth - 1);
  }
  return zs;
};

export const similarPoints = (c: PreperiodicPoint, depth: number): PreperiodicPoint[] => {
  const zs: XYType[] = [];

  let z = orbit(c.point, c.point, c.prePeriod);
  for (let i = 0; i < c.period; i++) {
    zs.push(z);
    depthFirstSearch(mult([-1, 0], z), c.point, zs, depth);
    z = add(square(z), c.point);
  }
  return zs.map((p) => new PreperiodicPoint(c.point, p, true));
};

const forwardOrbit = (
  z: XYType,
  c: XYType,
  maxIterations: number,
): [orbit: XYType[], prePeriod: number, period: number] => {
  const orbit: XYType[] = [];
  for (let i = 0; i < maxIterations; i++) {
    // eslint-disable-next-line no-loop-func
    orbit.push(z);
    const newZ = add(square(z), c);
    const similar = orbit.findIndex((elem) => equal(elem, newZ, 0.00001));
    if (similar !== -1) {
      return [orbit, similar, i - similar + 1];
    }
    if (magnitude(z) > 2) {
      return [orbit, i, -1];
    }
    z = newZ;
  }

  return [orbit, -1, -1];
};

export class PreperiodicPoint {
  point: XYType;
  prePeriod: number;
  period: number;
  factor: XYType;
  factorAngle: number;
  factorMagnitude: number;
  selfSimilarityFactor: XYType;
  selfSimilarityFactorMagnitude: number;
  selfSimilarityFactorAngle: number;

  constructor(c: XYType, z: XYType, julia: boolean) {
    this.point = z;

    const orbitInfo = forwardOrbit(this.point, c, 50);

    this.prePeriod = orbitInfo[1];
    this.period = orbitInfo[2];

    julia
      ? (this.factor = magnificationRotationJulia(c, this.point))
      : (this.factor = magnificationRotationMandelbrot(c, this.prePeriod, this.period));

    this.factorMagnitude = magnitude(this.factor);
    this.factorAngle = Math.atan2(this.factor[1], this.factor[0]);

    this.selfSimilarityFactor = cycleEigenvalue(this.point, this.prePeriod, this.period);
    this.selfSimilarityFactorMagnitude = magnitude(this.selfSimilarityFactor);
    this.selfSimilarityFactorAngle = Math.atan2(
      this.selfSimilarityFactor[1],
      this.selfSimilarityFactor[0],
    );
  }

  toString(): string {
    return formatComplexNumber(this.point);
  }
}

export const alignSets = (
  newMagnification: number,
  mandelbrotControls: ViewerControlSprings,
  juliaControls: ViewerControlSprings,
  focusedPointMandelbrot: PreperiodicPoint,
  focusedPointJulia: PreperiodicPoint,
  rotate: boolean,
): void => {
  const makeZoom = (point: PreperiodicPoint) => point.factorMagnitude * newMagnification;
  const zoomM = makeZoom(focusedPointMandelbrot);
  const zoomJ = makeZoom(focusedPointJulia);

  mandelbrotControls.zoomCtrl[1]({
    z: zoomM,
  });
  juliaControls.zoomCtrl[1]({
    z: zoomJ,
  });

  if (rotate) {
    const selfSimilarityAngle =
      (Math.log(newMagnification) /
        Math.log(focusedPointMandelbrot.selfSimilarityFactorMagnitude)) *
      focusedPointMandelbrot.selfSimilarityFactorAngle;

    const makeRot = (point: PreperiodicPoint) =>
      -(point.factorAngle + selfSimilarityAngle);
    const rotM = makeRot(focusedPointMandelbrot);
    const rotJ = makeRot(focusedPointJulia);

    mandelbrotControls.rotCtrl[1]({
      theta: rotM,
    });
    juliaControls.rotCtrl[1]({
      theta: rotJ,
    });
  }
};
