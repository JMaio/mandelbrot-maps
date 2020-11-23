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
  showCoordinates: true,
  maxI: 250,
  showFPS: false,
  useDPR: false,
  useAA: false,
};

export type settingsWidgetType = {
  // - settings widgets key k must be in the set
  // - its type must be the union of FormControlLabelProps (for displaying in the Material UI form)
  //   and "k": the string representation of the setting, for updating the state correctly
  [k in keyof settingsDefinitionsType]: FormControlLabelProps;
};

export type settingsGroupType = {
  name: string;
  widgets: {
    [k in keyof Partial<settingsDefinitionsType>]: FormControlLabelProps;
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
