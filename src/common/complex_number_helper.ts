import { XYType } from '../common/types';

const TOLERANCE = 0.001;
const FLOATING_POINT_TOLERANCE = 0.01;
export const MAX_DEPTH = 4;

export function magnitude(p: XYType): number {
  return Math.sqrt(p[0] * p[0] + p[1] * p[1]);
}

export const distance = (a: XYType, b: XYType) => {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
};

const add = function (a: XYType, b: XYType): XYType {
  return [a[0] + b[0], a[1] + b[1]];
};

const sub = function (a: XYType, b: XYType): XYType {
  return [a[0] - b[0], a[1] - b[1]];
};

export const mult = function (a: XYType, b: XYType): XYType {
  return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
};

const divide = function (x: XYType, y: XYType): XYType {
  const d = Math.pow(y[0], 2) + Math.pow(y[1], 2);
  return [(x[0] * y[0] + x[1] * y[1]) / d, (x[1] * y[0] - x[0] * y[1]) / d];
};

const square = (c: XYType): XYType => {
  return [Math.pow(c[0], 2) - Math.pow(c[1], 2), 2.0 * c[0] * c[1]];
};

const sqrt = (c: XYType): XYType => {
  const theta = Math.atan2(c[1], c[0]);
  const r2 = Math.sqrt(magnitude(c));
  return [r2 * Math.cos(theta / 2), r2 * Math.sin(theta / 2)];
};

export function complexNumbersEqual(a: XYType, b: XYType): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

export const preImagePositive = function (z: XYType, c: XYType): XYType {
  return sqrt(sub(z, c));
};

export const preImageNegative = function (z: XYType, c: XYType): XYType {
  return mult([-1, 0], sqrt(sub(z, c)));
};

export const orbit = function (z: XYType, c: XYType, t: number): XYType {
  for (let i = 0; i < t; i++) {
    z = add(square(z), c);
  }
  return z;
};

export const orbitList = function (
  z: XYType,
  c: XYType,
  maxIterations: number,
): [XYType[], number, number] {
  const points = [];
  for (let i = 0; i < maxIterations; i++) {
    const similar = points.findIndex((elem) => distance(elem, z) < TOLERANCE);
    if (similar !== -1) {
      // we've hit a cycle
      return [points, similar, i - similar];
    }
    points.push(z);
    z = add(square(z), c);
  }
  return [points, -1, -1];
};

/**
 * Take the derivative of f sub c with respect to z
 *
 * This value depends not on z per se., but the orbit of z.
 *
 * @param z - The point we're taking the derivative w.r.t
 * @param c - The fixed constant +c of iteration
 * @param t - How many iterations to go for
 * @returns The derivative of W at c
 */
export const orbitEigenvalue = function (z: XYType, c: XYType, t: number): XYType {
  let der: XYType = [1, 0];
  for (let i = 0; i < t; i++) {
    der = mult([2, 0], mult(der, z));
    z = add(square(z), c);
  }

  return der;
};

/**
 * Find the preperiod of a given point under iteration. This assumes it is preperiodic
 *
 * @param c - The point
 * @returns If it's preperiodic: the preperiod, if it's periodic: nonsense, otherwise: -1.
 */
export const prePeriod = (z: XYType, c: XYType): number => {
  const olds: XYType[] = [];
  for (let i = 0; i < 50; i++) {
    olds.push(z);
    const newZ: XYType = add(square(z), c);
    const similar = olds.findIndex((elem) => distance(elem, newZ) < TOLERANCE);
    if (similar !== -1) return similar;

    z = newZ;
  }
  return -1;
};

/**
 * Find the period of a given point.
 *
 * @param z - The point
 * @param c - The constant of iteration
 * @returns The period, otherwise: -1.
 */
export const period = (z: XYType, c: XYType): number => {
  const olds: XYType[] = [];
  for (let i = 0; i < 50; i++) {
    olds.push(z);
    const newZ: XYType = add(square(z), c);
    const similar = olds.findIndex((elem) => distance(elem, newZ) < TOLERANCE);
    if (similar !== -1) {
      // we've hit a cycle
      return i - similar + 1;
    }
    z = newZ;
  }
  return -1;
};

/**
 * Subtract the first iterate in a cycle from the last.
 *
 * @param c - The point we care about. Must be periodic or preperiodic
 * @param z - The preperiod of c
 * @param l - The period of c
 * @returns The derivative of W at c
 */
const W = function (c: XYType, l: number, p: number) {
  const endOfCycle = orbit(c, c, l + p);
  const startOfCycle = orbit(c, c, l);

  return sub(endOfCycle, startOfCycle);
};

/**
 * Finds the numerical derivative of a function.
 *
 * @param c - The point we are taking the derivative of
 * @returns The derivative of f at c
 */
const numericalDerivative = function (c: XYType, f: (c: XYType) => XYType): XYType {
  const h = 1e-9;
  const withoutH = f(c);
  const withH = f(add(c, [h, 0]));

  return [sub(withH, withoutH)[0] / h, sub(withH, withoutH)[1] / h];
};

export const cycleEigenvalue = (c: XYType, l: number, p: number) => {
  const firstIterateInCycle: XYType = orbit(c, c, l);
  return orbitEigenvalue(firstIterateInCycle, c, p);
};

/**
 *
 * @param c - The point at the centre of the branch
 * @param l - The preperiod of c
 * @param p - The period of z
 * @returns The size of the branch
 */
export const magnificationRotationMandelbrot = function (
  c: XYType,
  l: number,
  p: number,
): XYType {
  const firstIterateInCycle: XYType = orbit(c, c, l);
  const cycleEigenvalue: XYType = orbitEigenvalue(firstIterateInCycle, c, p);

  return divide(
    numericalDerivative(c, (x: XYType) => W(x, l, p)),
    sub(cycleEigenvalue, [1, 0]),
  );
};

/**
 * the point where zero enters a cycle
 *
 * @param c - The point
 * @returns If it's preperiodic: the preperiod, if it's periodic: nonsense, otherwise: -1.
 */
export const getAlpha = (z: XYType, c: XYType): XYType => {
  const olds: XYType[] = [];
  for (let i = 0; i < 50; i++) {
    olds.push(z);
    const newZ: XYType = add(square(z), c);
    const similar = olds.findIndex((elem) => distance(elem, newZ) < TOLERANCE);
    if (similar !== -1) return newZ;

    z = newZ;
  }
  return [-7, -7];
};

export const reachAlpha = function (c: XYType, z: XYType): number {
  const alpha = getAlpha([0, 0], c);
  for (let i = 0; i < 50; i++) {
    if (distance(alpha, z) < TOLERANCE) return i;
    z = add(square(z), c);
  }
  return -1;
};

export const magnificationRotationJulia = function (
  c: XYType,
  z: XYType,
  q: number,
): XYType {
  return orbitEigenvalue(z, c, reachAlpha(c, z));
};

export function round(value: number, precision: number): number {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

export function formatComplexNumber(c: XYType): string {
  return `${round(c[0], 3)}${c[1] >= 0 ? '+' : ''}${round(c[1], 3)}i`;
}

export function formatAngle(angle: number): string {
  return `${round((180 / Math.PI) * angle, 0)}°`;
}

function findPotentialPreperiod(c: XYType): number {
  let z: XYType = c;
  let minNumber = 4;
  let minp = -1;
  for (let i = 0; i < 50; i++) {
    const newZ: XYType = add(square(z), c);
    const x = sub(newZ, z);
    if (magnitude(x) < minNumber) {
      minNumber = magnitude(x);
      minp = i;
    }
    z = newZ;
  }
  return minp;
}

const Wfried = function (c: XYType, l: number, p: number) {
  const endOfCycle = orbitEigenvalue(c, c, l + p);
  const startOfCycle = orbitEigenvalue(c, c, l);

  return sub(endOfCycle, startOfCycle);
};

export const findNearestMisiurewiczPoint = function (c: XYType): XYType {
  const q = findPotentialPreperiod(c);
  const p = 1;
  const learningRate: XYType = [0.01, 0];
  for (let i = 0; i < 1000; i++) {
    const F = W(c, q, p);
    const Fdash = Wfried(c, q, p);
    c = sub(c, mult(learningRate, divide(F, Fdash)));
  }
  return c;
};

const depthFirstSearch = (z: XYType, c: XYType, zs: XYType[], depth: number) => {
  zs.push(z);
  if (distance(z, c) > FLOATING_POINT_TOLERANCE && depth > 0) {
    depthFirstSearch(preImagePositive(z, c), c, zs, depth - 1);
    depthFirstSearch(preImageNegative(z, c), c, zs, depth - 1);
  }
  return zs;
};

export const similarPoints = (c: PreperiodicPoint): PreperiodicPoint[] => {
  const zs: XYType[] = [];

  for (let i = c.prePeriod; i < c.prePeriod + c.period; i++) {
    const z = orbit(c.point, c.point, i);
    zs.push(z);
    depthFirstSearch(mult([-1, 0], z), c.point, zs, MAX_DEPTH);
  }
  return zs.map((p) => new PreperiodicPoint(c.point, p));
};

const subscripts = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
export class PreperiodicPoint {
  point: XYType;
  c: XYType;
  u: XYType;
  a: XYType;
  prePeriod: number;
  period: number;
  uMagnitude: number;
  uAngle: number;
  aMagnitude: number;
  aAngle: number;

  constructor(c: XYType, z: XYType) {
    this.point = z;
    this.c = c;

    this.prePeriod = prePeriod(this.point, c);
    this.period = period(this.point, c);

    this.u = magnificationRotationMandelbrot(c, this.prePeriod, this.period);
    this.uMagnitude = magnitude(this.u);
    this.uAngle = Math.atan2(this.u[1], this.u[0]);

    this.a = magnificationRotationJulia(c, this.point, this.prePeriod);
    this.aMagnitude = magnitude(this.a);
    this.aAngle = Math.atan2(this.a[1], this.a[0]);
  }

  toString(): string {
    let pre = `M${this.prePeriod},${this.period}`;
    for (let i = 0; i < 10; i++) {
      pre = pre.replaceAll(i.toString(), subscripts[i]);
    }
    return pre;
  }
}
