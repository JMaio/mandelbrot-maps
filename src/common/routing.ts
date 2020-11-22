import { useCallback, useEffect, useState } from 'react';
import { vScale } from 'vec-la-fp';
import { ViewerLocation, XYType } from './types';
import {
  screenScaleMultiplier,
  toFloatDisplayDefault,
  toFloatDisplayShort,
  viewerOrigin,
} from './values';
// import { Router, Route } from 'wouter';

// export interface NamedHashURLViewerInterface {
//   name: string;
//   v: ViewerLocation;
//   viewerAsHashURL: () => string
// }

export class NamedHashURLViewer {
  name: string;
  v: ViewerLocation;

  constructor(name: string, v: ViewerLocation) {
    this.name = name;
    this.v = v;
  }

  /**
   * convert a viewer's state into a defined URL representation
   * @param namedViewer the viewer object to be converted
   */
  asHashURL(): string {
    const { xy, z, theta } = this.v;
    return `/${this.name}@${xy[0]},${xy[1]},${z},${theta}`;
  }
}

export class ViewerURLManager {
  vs: {
    [k: string]: NamedHashURLViewer;
  };
  // m: NamedHashURLViewer;
  // j: NamedHashURLViewer;
  // constructor(m?: NamedHashURLViewer, j?: NamedHashURLViewer) {
  //   this.vs = {};
  //   this.vs['m'] = m || new NamedHashURLViewer('m', viewerOrigin);
  //   this.vs['j'] = j || new NamedHashURLViewer('j', viewerOrigin);
  // }
  constructor() {
    console.log(currentViewerState());
    const params = currentViewerState();
    this.vs = {};
    this.vs['m'] = new NamedHashURLViewer('m', params['m'] || viewerOrigin);
    this.vs['j'] = new NamedHashURLViewer('j', params['j'] || viewerOrigin);
  }

  asFullHashURL(): string {
    return `#${this.vs['m'].asHashURL()}${this.vs['j'].asHashURL()}`;
  }

  updateViewer(name: string, v: Partial<ViewerLocation>): void {
    // console.log('updateViewer');
    const { xy, z, theta } = v;
    // const [[{ xy }], [{ z }], [{ theta }]] = [xyC]
    // const [xy] = [xyCtrl?.xy];
    const newV = this.vs[name].v;
    if (xy !== undefined)
      newV.xy = vScale(screenScaleMultiplier, xy).map((n) =>
        toFloatDisplayDefault(n),
      ) as XYType;
    if (z !== undefined) newV.z = toFloatDisplayShort(z);
    if (theta !== undefined) newV.theta = toFloatDisplayShort(theta);

    // this.vs[name].v = {
    //   xy: vScale(screenScaleMultiplier, xy).map((n) =>
    //     toFloatDisplayDefault(n),
    //   ) as XYType,
    //   z: toFloatDisplayShort(z),
    //   theta: toFloatDisplayShort(theta),
    // };
    this.vs[name].v = newV;
  }

  // updateM(v: Partial<ViewerControlSprings>): void {
  //   const {
  //     xyCtrl: [{ xy }],
  //     zoomCtrl: [{ z }],
  //     rotCtrl: [{ theta }],
  //   } = v;
  //   this.vs['m'].v = {
  //     xy: vScale(screenScaleMultiplier, xy.getValue()).map((n) =>
  //       toFloatDisplayDefault(n),
  //     ) as XYType,
  //     z: toFloatDisplayShort(z.getValue()),
  //     theta: toFloatDisplayShort(theta.getValue()),
  //   };
  //   // if (name === 'm') {
  //   //   this.m.v = newV;
  //   // } else if (name === 'j') {
  //   //   this.j.v = newV;
  //   // }
  // }
  // updateJ(v: ViewerControlSprings): void {
  //   const {
  //     xyCtrl: [{ xy }],
  //     zoomCtrl: [{ z }],
  //     rotCtrl: [{ theta }],
  //   } = v;
  //   this.m.v = {
  //     xy: vScale(screenScaleMultiplier, xy.getValue()).map((n) =>
  //       toFloatDisplayDefault(n),
  //     ) as XYType,
  //     z: toFloatDisplayShort(z.getValue()),
  //     theta: toFloatDisplayShort(theta.getValue()),
  //   };
  //   // if (name === 'm') {
  //   //   this.m.v = newV;
  //   // } else if (name === 'j') {
  //   //   this.j.v = newV;
  //   // }
  // }

  updateFromViewer(m: Partial<ViewerLocation>, j: Partial<ViewerLocation>): void {
    this.updateViewer('m', m);
    this.updateViewer('j', j);
    // // mandelbrot
    // const {
    //   xyCtrl: [{ xy: mxy }],
    //   zoomCtrl: [{ z: mz }],
    //   rotCtrl: [{ theta: mtheta }],
    // } = m;
    // this.m.v = {
    //   xy: vScale(screenScaleMultiplier, mxy.getValue()).map((n) =>
    //     toFloatDisplayDefault(n),
    //   ) as XYType,
    //   z: toFloatDisplayShort(mz.getValue()),
    //   theta: toFloatDisplayShort(mtheta.getValue()),
    // };
    // // julia
    // const {
    //   xyCtrl: [{ xy: jxy }],
    //   zoomCtrl: [{ z: jz }],
    //   rotCtrl: [{ theta: jtheta }],
    // } = j;
    // this.j.v = {
    //   xy: vScale(screenScaleMultiplier, jxy.getValue()).map((n) =>
    //     toFloatDisplayDefault(n),
    //   ) as XYType,
    //   z: toFloatDisplayShort(jz.getValue()),
    //   theta: toFloatDisplayShort(jtheta.getValue()),
    // };
  }
  // function fromHash()

  // this should manage the hash part of the URL

  // should have an "update()" method:
  // takes in changes in the viewers, and writes to the URL

  // state of the current viewers
  // if only one parameter changes, the whole URL needs to update
}

// returns the current hash location in a normalized form
// (excluding the leading '#' symbol)
export const currentLocation = (): string => {
  // console.log(window.location);
  const l = window.location.hash.replace('#/', '') || '';
  return l;
};

export const currentViewerState = (): { [k: string]: ViewerLocation } => {
  const l = currentLocation();
  const viewerParams: { [k: string]: ViewerLocation } = {};
  try {
    const qs = l.split('/');
    qs.forEach((s) => {
      const [v, params] = s.split('@');
      const [x, y, z, t] = params.split(',').map(Number);
      viewerParams[v] = { xy: [x, y] as XYType, z: z, theta: t };
    });
  } catch (error) {
    console.log(error);
  }
  return viewerParams;
};

export const useHashLocation = (): [
  string,
  React.Dispatch<React.SetStateAction<string>>,
] => {
  const [loc, setLoc] = useState(currentLocation());
  // console.log(loc);

  useEffect(() => {
    // this function is called whenever the hash changes
    const handler = () => setLoc(currentLocation());

    // subscribe to hash changes
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  // remember to wrap your function with `useCallback` hook
  // a tiny but important optimization
  const navigate = useCallback((to) => (window.location.hash = to), []);

  return [loc, navigate];
};
