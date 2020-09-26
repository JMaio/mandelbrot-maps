import { Slider, Switch } from '@material-ui/core';
import React from 'react';
import {
  settingsDefinitionsType,
  settingsGroupType,
  settingsWidgetType,
} from '../common/settings';

export const defaultSettings = {
  minimap: true,
  crosshair: true,
  coordinates: false,
  maxI: 250,
  useDPR: false,
  useAA: false,
  showFPS: false,
};

export const settingsWidgets = (
  settings: settingsDefinitionsType,
): settingsWidgetType => ({
  minimap: {
    label: 'Minimap',
    checked: settings.minimap,
    control: <Switch />,
  },
  crosshair: {
    label: 'Crosshair',
    checked: settings.crosshair,
    control: <Switch />,
  },
  coordinates: {
    label: 'Show coordinates',
    checked: settings.coordinates,
    control: <Switch />,
  },
  maxI: {
    label: 'Iterations',
    value: settings.maxI,
    labelPlacement: 'top',
    style: {
      marginLeft: 0,
      marginRight: 0,
    },
    control: (
      <Slider
        min={5}
        max={1000}
        step={5}
        valueLabelDisplay="auto"
        marks={[
          { value: 5, label: 5 },
          { value: 250, label: 250 },
          { value: 500, label: 500 },
          { value: 750, label: 750 },
          { value: 1000, label: 1000 },
        ]}
      />
    ),
  },
  useDPR: {
    // https://stackoverflow.com/a/12830454/9184658
    // // There is a downside that values like 1.5 will give "1.50" as the output. A fix suggested by @minitech:
    // var numb = 1.5;
    // numb = +numb.toFixed(2);
    // // Note the plus sign that drops any "extra" zeroes at the end.
    // // It changes the result (which is a string) into a number again (think "0 + foo"),
    // // which means that it uses only as many digits as necessary.
    label: `Use pixel ratio (${+window.devicePixelRatio.toFixed(3)})`,
    checked: settings.useDPR,
    control: <Switch />,
  },
  useAA: {
    label: `Anti-aliasing (slow)`,
    checked: settings.useAA,
    control: <Switch />,
  },
  showFPS: {
    label: `Show FPS`,
    checked: settings.showFPS,
    control: <Switch />,
  },
});

export const getSettingsWidgetsGrouping = (
  settingsWidgets: settingsWidgetType,
): Array<settingsGroupType> => [
  {
    name: 'Interface',
    widgets: {
      minimap: settingsWidgets.minimap,
      crosshair: settingsWidgets.crosshair,
      coordinates: settingsWidgets.coordinates,
    },
  },
  {
    name: 'Graphics',
    widgets: {
      maxI: settingsWidgets.maxI,
      useDPR: settingsWidgets.useDPR,
      useAA: settingsWidgets.useAA,
      showFPS: settingsWidgets.showFPS,
    },
  },
];

export default defaultSettings;
