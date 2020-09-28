import { Slider, Switch } from '@material-ui/core';
import React from 'react';
import {
  settingsDefinitionsType,
  settingsGroupType,
  settingsWidgetType,
} from '../../common/settings';

export const defaultSettings = {
  showMinimap: true,
  showCrosshair: true,
  showCoordinates: false,
  maxI: 250,
  showFPS: false,
  useDPR: false,
  useAA: false,
};

export const settingsWidgets = (
  settings: settingsDefinitionsType,
): settingsWidgetType => ({
  showMinimap: {
    k: 'showMinimap',
    label: 'Minimap',
    checked: settings.showMinimap,
    control: <Switch />,
  },
  showCrosshair: {
    k: 'showCrosshair',
    label: 'Crosshair',
    checked: settings.showCrosshair,
    control: <Switch />,
  },
  showCoordinates: {
    k: 'showCoordinates',
    label: 'Show coordinates',
    checked: settings.showCoordinates,
    control: <Switch />,
  },
  maxI: {
    k: 'maxI',
    label: 'Iterations',
    value: settings.maxI,
    labelPlacement: 'top',
    style: {
      marginLeft: 0,
      marginRight: 0,
    },
    control: (
      <Slider
        min={10}
        max={1000}
        step={10}
        valueLabelDisplay="auto"
        marks={[
          { value: 10, label: 10 },
          { value: 250, label: 250 },
          { value: 500, label: 500 },
          { value: 750, label: 750 },
          { value: 1000, label: 1000 },
        ]}
      />
    ),
  },
  useDPR: {
    k: 'useDPR',
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
    k: 'useAA',
    label: `Anti-aliasing (slow)`,
    checked: settings.useAA,
    control: <Switch />,
  },
  showFPS: {
    k: 'showFPS',
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
    widgets: [
      settingsWidgets.showMinimap,
      settingsWidgets.showCrosshair,
      settingsWidgets.showCoordinates,
    ],
  },
  {
    name: 'Graphics',
    widgets: [
      settingsWidgets.maxI,
      settingsWidgets.useDPR,
      settingsWidgets.useAA,
      settingsWidgets.showFPS,
    ],
  },
];

export default defaultSettings;
