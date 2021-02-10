import { Slider, Switch } from '@material-ui/core';
import ExtensionIcon from '@material-ui/icons/Extension';
import PhotoIcon from '@material-ui/icons/Photo';
import React from 'react';
import { RgbColorPicker } from 'react-colorful';
import {
  perturbationIterationLevels,
  settingsDefinitionsType,
  settingsGroupType,
  settingsWidgetsList,
} from '../../common/settings';

export const settingsWidgets = (
  settings: settingsDefinitionsType,
): settingsWidgetsList => ({
  showMinimap: {
    label: 'Minimap',
    checked: settings.showMinimap,
    control: <Switch />,
    helptext: `
Minimaps are shown on the bottom-left of each viewer.
A minimap shows the current position in the viewer at a zoom scale of 1x.

Clicking on a minimap will reset the current zoom level to 1x.
    `,
  },
  showCrosshair: {
    label: 'Crosshair',
    checked: settings.showCrosshair,
    control: <Switch />,
    helptext: `
Pinpoints the centre point of the Mandelbrot viewer with a plus-shaped indicator.
    `,
  },
  showCoordinates: {
    label: 'Show coordinates',
    checked: settings.showCoordinates,
    control: <Switch />,
    helptext: `
Displays the current viewer coordinates on the top-right corner,
and allows warping to specific coordinates 
(Mandelbrot viewer only).
    `,
  },
  maxI: {
    label: 'Iterations',
    value: settings.maxI,
    labelPlacement: 'top',
    style: {
      margin: 0,
    },
    control: (
      <Slider
        min={16}
        max={1024}
        // step={16}
        step={null}
        valueLabelDisplay="auto"
        marks={perturbationIterationLevels}
      />
    ),
    helptext: `
Sets the maximum times to iterate the fractal:
lower values reduce image accuracy, 
**higher values may reduce performance**.
    `,
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
    helptext: `
If your device's screen has a high pixel density (ratio > 1.0), using 
DPR (Device Pixel Ratio) will increase the sharpness of the image,
but **may reduce performance**.
    `,
  },
  useAA: {
    label: `Anti-aliasing (slow)`,
    checked: settings.useAA,
    control: <Switch />,
    helptext: `
Anti-aliasing provides a smoothing effect which increases the quality of the image, 
but can **severely reduce performance and crash the application**.
    `,
  },
  showFPS: {
    label: `Show FPS`,
    checked: settings.showFPS,
    control: <Switch />,
    helptext: `
Measures performance by displaying the current 
"Frames Per Second" on the top-left corner.

Higher values indicate better performance, while lower values 
mean that your device is slowing down significantly.

Browsers ususally set an upper bound on FPS that is equal 
to the refresh rate of your display (most commonly 60 FPS).
    `,
  },
  colour: {
    label: null,
    // fixes horizontal alignment
    labelPlacement: 'top',
    style: {
      // padding top higher because of saturation/value selector extending
      paddingTop: 12,
      paddingBottom: 8,
      paddingLeft: 0,
      paddingRight: 0,
      margin: 0,
    },
    control: (
      <RgbColorPicker
        // set the initial colour
        color={settings.colour}
      />
    ),
    helptext: `
Changes the primary colour of the viewers in HSV (Hue / Saturation / Value).

The top picker changes *Saturation* (horizontally) and *Value* (vertically).
The bottom picker changes *Hue*.
    `,
  },
});

export const getSettingsWidgetsGrouping = (
  settingsWidgets: settingsWidgetsList,
): Array<settingsGroupType> => [
  {
    icon: ExtensionIcon,
    name: 'Interface',
    widgets: {
      showMinimap: settingsWidgets.showMinimap,
      showCrosshair: settingsWidgets.showCrosshair,
      showCoordinates: settingsWidgets.showCoordinates,
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
