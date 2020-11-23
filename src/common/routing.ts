import { useCallback, useEffect, useState } from 'react';
import { vScale } from 'vec-la-fp';
import { ReactUseStateType, ViewerControlSprings, ViewerLocation, XYType } from './types';
import { screenToReal } from './utils';
import {
  defaultJuliaStart,
  defaultMandelbrotStart,
  screenScaleMultiplier,
  toFloatDisplayDefault,
  toFloatDisplayShort,
  viewerOrigin,
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
    const params = currentViewerState();
    console.log(params);
    this.vs = {};
    // need to create a copy of "viewerOrigin", otherwise they will be synchronized
    this.vs['m'] = new NamedHashURLViewer(
      'm',
      params['m'] || { ...defaultMandelbrotStart },
    );
    this.vs['j'] = new NamedHashURLViewer('j', params['j'] || { ...defaultJuliaStart });
  }

  asFullHashURL(): string {
    return `#${this.vs['m'].asHashURL()}${this.vs['j'].asHashURL()}`;
  }

  updateViewer(name: string, v: ViewerControlSprings): void {
    // console.log('updateViewer');
    const [{ xy }] = v.xyCtrl;
    const [{ z }] = v.zoomCtrl;
    const [{ theta }] = v.rotCtrl;
    // const [[{ xy }], [{ z }], [{ theta }]] = [xyC]
    // const [xy] = [xyCtrl?.xy];
    // const newV = this.vs[name].v;

    this.vs[name].v = {
      xy: xy.getValue().map(screenToReal).map(toFloatDisplayDefault) as XYType,
      z: toFloatDisplayShort(z.getValue()),
      theta: toFloatDisplayShort(theta.getValue()),
    };

    // if (xy !== undefined)
    //   newV.xy = vScale(screenScaleMultiplier, xy).map((n) =>
    //     toFloatDisplayDefault(n),
    //   ) as XYType;
    // if (z !== undefined) newV.z = toFloatDisplayShort(z);
    // if (theta !== undefined) newV.theta = toFloatDisplayShort(theta);

    // this.vs[name].v = newV;
  }

  // updateFromViewer(m: Partial<ViewerLocation>, j: Partial<ViewerLocation>): void {
  //   this.updateViewer('m', m);
  //   this.updateViewer('j', j);
  // }
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
    // likely not split, url is incorrect
    // console.log(error);
  }
  return viewerParams;
};

// https://github.com/molefrog/wouter#uselocation-hook-working-with-the-history
export const useHashLocation = (): ReactUseStateType<string> => {
  const [loc, setLoc] = useState(currentLocation());
  // console.log(loc);

  useEffect(() => {
    // this function is called whenever the hash changes
    const handler = () => {
      const c = currentLocation();
      console.log(`hash changed => ${c}`);
      setLoc(c);
    };

    // subscribe to hash changes
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  // remember to wrap your function with `useCallback` hook
  // a tiny but important optimization

  const navigate = useCallback(
    // https://github.com/whatwg/html/issues/2174
    // https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState
    (to) => {
      console.log(to);
      window.history.replaceState(null, document.title, to);
    },
    [],
  );

  return [loc, navigate];
};

export const updateHash = (
  urlManager: ViewerURLManager,
  name: string,
  v: ViewerControlSprings,
  navigate: React.Dispatch<React.SetStateAction<string>>,
): void => {
  // console.log(loc);
  console.log(urlManager.vs);
  // console.log(name, v);
  // urlManager.updateFromViewer(mandelbrotControls, juliaControls);
  urlManager.updateViewer(name, v);
  const u = urlManager.asFullHashURL();
  // console.log(u);
  navigate(u);
};
