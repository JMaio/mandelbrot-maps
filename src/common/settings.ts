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

// using "key" results in an error since it is not used again
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
export type settingsWidgetType = {
  [key in keyof settingsDefinitionsType]: FormControlLabelProps & { k: key };
};

export type settingsGroupType = {
  name: string;
  widgets: Array<FormControlLabelProps & { k: keyof settingsDefinitionsType }>;
  // [key in keyof settingsDefinitionsType]: ;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // };
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
