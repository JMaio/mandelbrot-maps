import { FormControlLabelProps, SvgIcon } from '@material-ui/core';
import React from 'react';
import { RgbColor } from 'react-colorful';
import { defaultShadingColour } from './values';
// https://stackoverflow.com/a/39281228/9184658

export type settingsDefinitionsType = {
  showMinimap: boolean;
  showCrosshair: boolean;
  showCoordinates: boolean;
  showFPS: boolean;
  maxI: number;
  useDPR: boolean;
  useAA: boolean;
  colour: RgbColor;
};

export const defaultSettings = {
  showMinimap: true,
  showCrosshair: true,
  showCoordinates: false,
  maxI: 256,
  showFPS: false,
  useDPR: false,
  useAA: false,
  colour: defaultShadingColour,
};

export const defaultIterationLevels = [10, 250, 500, 750, 1000].map((i) => ({
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
export const perturbationIterationLevels = [
  4,
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
].map((i) => ({
  value: i * i,
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
  helpState: [boolean, () => void];
}

export interface FirstTimeInfoProps {
  ctrl: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}
