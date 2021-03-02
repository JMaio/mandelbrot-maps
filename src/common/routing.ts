import { useCallback, useEffect, useState } from 'react';
import {
  precisionFormatterInterface,
  ReactUseStateType,
  ViewerLocation,
  XYType,
} from './types';
import { defaultJuliaStart, defaultMandelbrotStart, defaultViewerStart } from './values';

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
  // precision: precisionSpecifier;
  // fmt: precisionFormatterInterface;

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

  updateViewer(
    name: string,
    v: Partial<ViewerLocation>,
    fmt: precisionFormatterInterface,
  ): void {
    const { xy, z, theta } = v;
    // console.log('updateViewer:', fmt);
    // const [[{ xy }], [{ z }], [{ theta }]] = [xyC]
    // const [xy] = [xyCtrl?.xy];
    const newV = this.vs[name].v;
    if (xy !== undefined) newV.xy = xy.map((n) => +fmt.toFloatDisplayFixed(n)) as XYType;
    if (z !== undefined) newV.z = +fmt.toFloatDisplayShort(z);
    if (theta !== undefined) newV.theta = +fmt.toFloatDisplayShort(theta);

    this.vs[name].v = newV;
  }

  updateFromViewer(
    m: Partial<ViewerLocation>,
    j: Partial<ViewerLocation>,
    fmt: precisionFormatterInterface,
  ): void {
    this.updateViewer('m', m, fmt);
    this.updateViewer('j', j, fmt);
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
  // key 'k' used to index which viewer is parsed
  const viewerParams: { [k: string]: ViewerLocation } = {};
  // actually parse the hash
  try {
    // separate each viewer's string, remove the empty string from the start
    // (/abc/123) split => ['', 'abc', '123']
    const qs = l.split('/').filter((v) => v.length > 0);
    qs.forEach((s) => {
      // viewer [name, params] is separated by @ sign
      // assume this first split must succeed for any input to be parseable
      const [v, params] = s.split('@');
      const parsedVals = params.split(',').map(Number);
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
      if (parsedVals.some(isNaN)) {
        // at least one parsing fail, stop now
        viewerParams[v] = defaultViewerStart[v];
      } else {
        const [x, y, z, t] = parsedVals;
        viewerParams[v] = { xy: [x, y] as XYType, z: z, theta: t };
      }
    });
  } catch (error) {
    // uhhhh, something's wrong
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
