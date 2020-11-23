import { useCallback, useEffect, useState } from 'react';
import { ReactUseStateType, ViewerLocation, XYType } from './types';
import {
  defaultJuliaStart,
  defaultMandelbrotStart,
  toFloatDisplayDefault,
  toFloatDisplayShort,
} from './values';

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

  constructor() {
    this.vs = {};
    this.updateFromURL();
  }

  asFullHashURL(): string {
    return `#${this.vs['m'].asHashURL()}${this.vs['j'].asHashURL()}`;
  }

  updateFromURL(): void {
    const params = currentViewerState();
    this.vs['m'] = new NamedHashURLViewer(
      'm',
      params['m'] || { ...defaultMandelbrotStart },
    );
    this.vs['j'] = new NamedHashURLViewer('j', params['j'] || { ...defaultJuliaStart });
  }

  updateViewer(name: string, v: Partial<ViewerLocation>): void {
    // console.log('updateViewer');
    const { xy, z, theta } = v;
    // const [[{ xy }], [{ z }], [{ theta }]] = [xyC]
    // const [xy] = [xyCtrl?.xy];
    const newV = this.vs[name].v;
    if (xy !== undefined) newV.xy = xy.map((n) => toFloatDisplayDefault(n)) as XYType;
    if (z !== undefined) newV.z = toFloatDisplayShort(z);
    if (theta !== undefined) newV.theta = toFloatDisplayShort(theta);

    this.vs[name].v = newV;
  }

  updateFromViewer(m: Partial<ViewerLocation>, j: Partial<ViewerLocation>): void {
    this.updateViewer('m', m);
    this.updateViewer('j', j);
  }
}

// returns the current hash location in a normalized form
// (excluding the leading '#' symbol)
export const currentLocation = (): string => {
  // console.log(window.location);
  const l = window.location.hash.replace('#', '') || '';
  return l;
};

export const currentViewerState = (): { [k: string]: ViewerLocation } => {
  const l = currentLocation();
  const viewerParams: { [k: string]: ViewerLocation } = {};
  try {
    const qs = l.split('/').filter((v) => v.length > 0);
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

// non-reloading hash change
export const useHashNavigator = (): ((to: string) => void) =>
  useCallback((to) => window.history.replaceState(null, document.title, to), []);

// https://github.com/molefrog/wouter#customizing-the-location-hook
export const useHashLocation = (): ReactUseStateType<string> => {
  const [loc, setLoc] = useState(currentLocation());

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
