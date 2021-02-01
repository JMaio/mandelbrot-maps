import { Slider, Switch } from '@material-ui/core';
import ExtensionIcon from '@material-ui/icons/Extension';
import PhotoIcon from '@material-ui/icons/Photo';
import React from 'react';
import { RgbColorPicker } from 'react-colorful';
import {
  settingsDefinitionsType,
  settingsGroupType,
  settingsWidgetType,
} from '../../common/settings';

export const settingsWidgets = (
  settings: settingsDefinitionsType,
): settingsWidgetType => ({
  showMinimap: {
    label: 'Minimap',
    checked: settings.showMinimap,
    control: <Switch />,
  },
  showCrosshair: {
    label: 'Crosshair',
    checked: settings.showCrosshair,
    control: <Switch />,
  },
  showCoordinates: {
    label: 'Show coordinates',
    checked: settings.showCoordinates,
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
  showOrbit: {
    label: `Show orbit`,
    checked: settings.showOrbit,
    control: <Switch />,
  },
  colour: {
    label: null,
    style: {
      marginTop: 14,
      marginBottom: 10,
      marginLeft: 0,
      marginRight: 0,
    },
    control: (
      <RgbColorPicker
        // set the initial colour
        color={settings.colour}
      />
    ),
  },
});

export const getSettingsWidgetsGrouping = (
  settingsWidgets: settingsWidgetType,
): Array<settingsGroupType> => [
  {
    icon: ExtensionIcon,
    name: 'Interface',
    widgets: {
      showMinimap: settingsWidgets.showMinimap,
      showCrosshair: settingsWidgets.showCrosshair,
      showCoordinates: settingsWidgets.showCoordinates,
      showOrbit: settingsWidgets.showOrbit,
    },
    // ],
  },
  {
    icon: PhotoIcon,
    name: 'Graphics',
    widgets: {
      maxI: settingsWidgets.maxI,
      colour: settingsWidgets.colour,
      useDPR: settingsWidgets.useDPR,
      useAA: settingsWidgets.useAA,
      showFPS: settingsWidgets.showFPS,
    },
  },
];
