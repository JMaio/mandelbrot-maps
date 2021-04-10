import { Button, Card } from '@material-ui/core';
import { ViewerControlSprings, XYType } from '../../common/types';
import React from 'react';

export const MAX_DEPTH = 4;

const MAX_PREPERIOD = 1000;

export enum OrbitFlag {
  Divergent,
  Cyclic,
  Acyclic,
}

const equal = (a: XYType, b: XYType, tolerance = 1e-10): boolean => {
  const d = sub(a, b);
  const dx: number = Math.abs(d[0]);
  const dy: number = Math.abs(d[1]);
  return dx < tolerance && dy < tolerance;
};

function magnitude(p: XYType): number {
  return Math.sqrt(p[0] * p[0] + p[1] * p[1]);
}

const add = function (a: XYType, b: XYType): XYType {
  return [a[0] + b[0], a[1] + b[1]];
};

const sub = function (a: XYType, b: XYType): XYType {
  return [a[0] - b[0], a[1] - b[1]];
};

const mult = function (a: XYType, b: XYType): XYType {
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

const preImagePositive = function (z: XYType, c: XYType): XYType {
  return sqrt(sub(z, c));
};

const preImageNegative = function (z: XYType, c: XYType): XYType {
  return mult([-1, 0], preImagePositive(z, c));
};

const orbit = function (z: XYType, c: XYType, t: number): XYType {
  for (let i = 0; i < t; i++) {
    z = add(square(z), c);
  }
  return z;
};

const orbitEigenvalue = function (z: XYType, c: XYType, t: number): XYType {
  let der: XYType = [1, 0];
  for (let i = 0; i < t; i++) {
    der = mult([2, 0], mult(der, z));
    z = add(square(z), c);
  }

  return der;
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

const cycleEigenvalue = (c: XYType, l: number, p: number): XYType => {
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
const magnificationRotationMandelbrot = function (
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

const reachAlpha = function (c: XYType, z: XYType): number {
  const alpha = getAlpha([0, 0], c);
  for (let i = 0; i < 50; i++) {
    if (equal(alpha, z)) return i;
    z = add(square(z), c);
  }
  return -1;
};

const magnificationRotationJulia = function (c: XYType, z: XYType, q: number): XYType {
  return orbitEigenvalue(z, c, reachAlpha(c, z));
};

export function round(value: number, precision: number): number {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

export function formatComplexNumber(c: XYType, precision = 3): string {
  return `${round(c[0], precision)}${c[1] >= 0 ? '+' : ''}${round(c[1], precision)}i`;
}

export function formatAngle(angle: number): string {
  return `${round((180 / Math.PI) * angle, 0)}°`;
}

function findPotentialPreperiod(c: XYType): number {
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
}

const Wfried = function (c: XYType, l: number, p: number) {
  const endOfCycle = orbitEigenvalue(c, c, l + p);
  const startOfCycle = orbitEigenvalue(c, c, l);

  return sub(endOfCycle, startOfCycle);
};

export const findNearestMisiurewiczPoint = function (
  c: XYType,
  iterations: number,
): XYType {
  const q = findPotentialPreperiod(c);
  if (q === 0) {
    return [0, 0];
  }
  const p = 1;
  const learningRate: XYType = [0.01, 0];
  for (let i = 0; i < iterations; i++) {
    const F = W(c, q, p);
    const Fdash = Wfried(c, q, p);
    c = sub(c, mult(learningRate, divide(F, Fdash)));
  }
  return c;
};

const depthFirstSearch = (z: XYType, c: XYType, zs: XYType[], depth: number) => {
  zs.push(z);
  if (!equal(z, c) && depth > 0) {
    depthFirstSearch(preImagePositive(z, c), c, zs, depth - 1);
    depthFirstSearch(preImageNegative(z, c), c, zs, depth - 1);
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

const forwardOrbit = function (
  z: XYType,
  c: XYType,
  maxIterations: number,
): [orbit: XYType[], prePeriod: number, period: number, flag: OrbitFlag] {
  const orbit: XYType[] = [];
  for (let i = 0; i < maxIterations; i++) {
    // eslint-disable-next-line no-loop-func
    orbit.push(z);
    const newZ = add(square(z), c);
    const similar = orbit.findIndex((elem) => equal(elem, newZ, 0.001));
    if (similar !== -1) {
      return [orbit, similar, i - similar + 1, OrbitFlag.Cyclic];
    }
    if (magnitude(z) > 2) {
      return [orbit, i, -1, OrbitFlag.Divergent];
    }
    z = newZ;
  }

  return [orbit, -1, -1, OrbitFlag.Acyclic];
};

const subscripts = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
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

    const orbitInfo = forwardOrbit(this.point, c, 200);

    this.prePeriod = orbitInfo[1];
    this.period = orbitInfo[2];

    julia
      ? (this.factor = magnificationRotationJulia(c, this.point, this.prePeriod))
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
    let pre = `M${this.prePeriod},${this.period}`;
    for (let i = 0; i < 10; i++) {
      pre = pre.replaceAll(i.toString(), subscripts[i]);
    }
    return pre;
  }
}

/**
 * the point where zero enters a cycle
 *
 * @param c - The point
 * @returns If it's preperiodic: the preperiod, if it's periodic: nonsense, otherwise: -1.
 */
const getAlpha = (z: XYType, c: XYType): XYType => {
  const olds: XYType[] = [];
  for (let i = 0; i < 50; i++) {
    olds.push(z);
    const newZ = add(square(z), c);
    const similar = olds.findIndex((elem) => equal(elem, newZ));
    if (similar !== -1) return newZ;

    z = newZ;
  }
  return [-7, -7];
};

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
