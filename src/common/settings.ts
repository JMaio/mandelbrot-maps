import { FormControlLabelProps } from '@material-ui/core';
import React from 'react';
// https://stackoverflow.com/a/39281228/9184658

export type settingsDefinitionsType = {
  showMinimap: boolean;
  showCrosshair: boolean;
  showCoordinates: boolean;
  showFPS: boolean;
  maxI: number;
  useDPR: boolean;
  useAA: boolean;
};

export const defaultSettings = {
  showMinimap: true,
  showCrosshair: true,
  showCoordinates: false,
  maxI: 250,
  showFPS: false,
  useDPR: false,
  useAA: false,
};

export type settingsWidgetType = {
  // - settings widgets key k must be in the set
  // - its type must be of FormControlLabelProps (for displaying in the Material UI form)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [k in keyof settingsDefinitionsType]: FormControlLabelProps;
  // using "k" results in an error since it is not used again
};

export type settingsGroupType = {
  name: string;
  widgets: {
    // widget groups may contain any of the keys in the settingsDefinitionsType
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [k in keyof Partial<settingsDefinitionsType>]: FormControlLabelProps;
    // using "k" results in an error since it is not used again
  };
};

export type SettingsContextType = {
  settings: settingsDefinitionsType;
  setSettings: React.Dispatch<React.SetStateAction<settingsDefinitionsType>>;
  settingsWidgets: settingsWidgetType;
};

export interface SettingsMenuProps {
  reset: () => void;
  toggleInfo: () => void;
}
