import { FormControlLabelProps, SvgIcon } from '@material-ui/core';
import React from 'react';
import { RgbColor } from 'react-colorful';
import { defaultShadingColour } from './values';
// https://stackoverflow.com/a/39281228/9184658

export type settingsDefinitionsType = {
  showMinimap: boolean;
  showCrosshair: boolean;
  showCoordinates: boolean;
  shadeMisiurewiczDomains: boolean;
  rotateWhileZooming: boolean;
  showFPS: boolean;
  maxI: number;
  useDPR: boolean;
  useAA: boolean;
  colour: RgbColor;
  deepZoom: boolean;
};

export const defaultSettings: settingsDefinitionsType = {
  showMinimap: true,
  showCrosshair: true,
  showCoordinates: false,
  shadeMisiurewiczDomains: false,
  rotateWhileZooming: false,
  maxI: 256,
  showFPS: false,
  useDPR: false,
  useAA: false,
  colour: defaultShadingColour,
  deepZoom: false,
};

export const defaultIterationLevels = [16, 250, 500, 750, 1000].map((i) => ({
  value: i,
  label: i,
}));
// const texsize = Math.ceil(Math.sqrt(orbit.length / 4));
// -----
// vec4 unpackOrbit(int i) {
//   float fi = float(i);
//   vec2 texcoord = vec2(mod(fi, texsize), floor(fi / texsize)) / texsize;
//   return texture2D(orbittex, texcoord);
// }
// squares: 6^2, 20^2, 32^2...
// bad iteration levels: 6, 7, 12, 13, 14, 15, 24, 26, 28, 30
// 19 iteration levels:
export const perturbationIterationLevels = [
  4, // prettier: keep multi-line - https://github.com/prettier/prettier-vscode/issues/352#issuecomment-417471927
  5,
  8,
  9,
  10,
  11,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  25,
  27,
  29,
  31,
  32,
]
  .map((l) => l * l)
  .map((l, i) => ({
    value: l,
    // only show the labels of the higher levels
    // i+n to ensure that 18 is mod n
    label: (i + 2) % 4 ? null : l,
  }));

// export const perturbationIterationLevels = _.range(2, 33, 2)
//   .map((i) => i * i)
//   .map((i) => ({
//     value: i,
//   }));

export type settingsWidgetType = FormControlLabelProps & { helptext?: string };

export type settingsWidgetsList = {
  // - settings widgets key k must be in the set
  // - its type must be of FormControlLabelProps (for displaying in the Material UI form)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [k in keyof settingsDefinitionsType]: settingsWidgetType;
  // using "k" results in an error since it is not used again
};

export type settingsGroupType = {
  name: string;
  icon: typeof SvgIcon;
  widgets: {
    // widget groups may contain any of the keys in the settingsDefinitionsType
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [k in keyof Partial<settingsDefinitionsType>]: settingsWidgetType;
    // using "k" results in an error since it is not used again
  };
};

export type SettingsContextType = {
  settings: settingsDefinitionsType;
  setSettings: React.Dispatch<React.SetStateAction<settingsDefinitionsType>>;
  settingsWidgets: settingsWidgetsList;
  // newSettings: {
  //   [k in keyof settingsDefinitionsType]: [
  //     settingsDefinitionsType[k],
  //     React.Dispatch<React.SetStateAction<settingsDefinitionsType[k]>>,
  //   ];
  // };
};

export interface SettingsMenuProps {
  reset: () => void;
  toggleInfo: () => void;
  toggleTan: () => void;
  helpState: [boolean, () => void];
}

export interface FirstTimeInfoProps {
  ctrl: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}
