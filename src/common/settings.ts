import { FormControlLabelProps } from '@material-ui/core';
import React from 'react';
// https://stackoverflow.com/a/39281228/9184658

export type settingsDefinitionsType = {
  minimap: boolean;
  crosshair: boolean;
  coordinates: boolean;
  maxI: number;
  useDPR: boolean;
  useAA: boolean;
  showFPS: boolean;
};

export type settingsWidgetType = {
  // using "key" results in an error since it is not used again
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [key in keyof settingsDefinitionsType]: FormControlLabelProps;
};

export type settingsGroupType = {
  name: string;
  widgets: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [key in keyof settingsDefinitionsType]?: FormControlLabelProps;
  };
};

export type SettingsContextType = {
  settings: settingsDefinitionsType;
  setSettings: React.Dispatch<React.SetStateAction<settingsDefinitionsType>>;
  settingsWidgets: settingsWidgetType;
};
