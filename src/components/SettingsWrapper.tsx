import { Slider, Switch } from '@material-ui/core';
import React, { ReactNode, useContext, useState } from 'react';

export interface setting<T extends number | boolean> {
  label: string;
  control: JSX.Element;
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
  // defaultValue: T;
  // set?: React.Dispatch<React.SetStateAction<T>>;
  display: {
    checked?: boolean;
    value?: T;
  };
}

// export interface booleanSetting extends setting {
//   display: {
//     checked?: boolean;
//   };
// }

// export interface valueSetting<T> extends setting {
//   value?: T;
// }

type StateType<T> = [T, React.Dispatch<React.SetStateAction<T>>];

export type settingsGroupType = {
  name: string;
  widgets: {
    [key: string]: setting<number> | setting<boolean>;
  };
};
// // https://reactjs.org/docs/context.html#updating-context-from-a-nested-component
// // no grouping: all settings are accessible
// const defaultSettings = {
//   minimap: {
//     label: 'Minimap',
//     k: 'minimap',
//     v: true,
//     control: <Switch />,
//   },
//   // crosshair: true,
//   // coords: false,
//   // maxI: 250,
//   // useAA: false,
//   // useDPR: false,
//   // showFPS: false,
// };

// export type settingsObjectType = typeof defaultSettings;
// const defaultSettings = () => ({
//   minimap: {
//     label: 'Minimap',
//     k: 'minimap',
//     v: useState(true),
//     control: <Switch />,
//   },
//   // crosshair: true,
//   // coords: false,
//   // maxI: 250,
//   // useAA: false,
//   // useDPR: false,
//   // showFPS: false,
// });
type settingsStateType = {
  minimap: boolean;
  crosshair: boolean;
  coords: boolean;
  maxI: number;
};

type settingsWidgetType = {
  minimap: setting<boolean>;
  crosshair: setting<boolean>;
  coords: setting<boolean>;
  maxI: setting<number>;
};

export const SettingsContext = React.createContext<unknown>({});

// export const useSettings = () => useContext(SettingsContext);

export const getSettingsGrouping = (
  settingsContext: settingsWidgetType,
): Array<settingsGroupType> => [
  {
    name: 'Interface',
    widgets: {
      minimap: settingsContext.minimap,
      crosshair: settingsContext.crosshair,
      coords: settingsContext.coords,
    },
  },
  {
    name: 'Graphics',
    widgets: {
      maxI: settingsContext.maxI,
      // settings.useAA,
      // settings.useDPR,
      // settings.showFPS,
    },
    // maxI: useState(250),
    // useAA: useState(false),
    // useDPR: useState(false),
    // fps: useState(false),
  },
];

// const renderableSetting = (setting: booleanSetting): setting is booleanSetting => {
//   const [s, setS] = useState(setting.defaultValue);
//   // if (setting) const;
//   return setting;
// };
// https://www.typescriptlang.org/docs/handbook/advanced-types.html#using-the-in-operator
// https://www.typescriptlang.org/docs/handbook/advanced-types.html#instanceof-type-guards
// const renderableSetting = <T extends booleanSetting | valueSetting<number>>(
//   setting: T,
// ): T => {
//   const [s, setS] = useState(setting.defaultValue);
//   if (typeof setting === 'booleanSetting') {
//     setting.checked = s;
//   }
//   // else
//   // if ()
//   // if (setting) const;
//   return { ...setting };
// };

export const SettingsProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  // https://reactjs.org/docs/context.html#updating-context-from-a-nested-component
  // no grouping: all settings are accessible

  const [settings, setSettings] = useState<settingsStateType>({
    minimap: true,
    crosshair: true,
    coords: false,
    maxI: 250,
  });

  const settingsWidgets: settingsWidgetType = {
    minimap: {
      label: 'Minimap',
      display: {
        checked: settings.minimap,
      },
      control: <Switch />,
    },
    crosshair: {
      label: 'Crosshair',
      display: {
        checked: settings.crosshair,
      },
      control: <Switch />,
    },
    coords: {
      label: 'Show coordinates',
      display: {
        checked: settings.coords,
      },
      control: <Switch />,
    },
    maxI: {
      label: 'Iterations',
      display: {
        value: settings.maxI,
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
      labelPlacement: 'top',
    },
    // useAA: false,
    // useDPR: false,
    // showFPS: false,
  };

  // const settingsBlueprint: settingsObjectType = {
  //   minimap: {
  //     label: 'Minimap',
  //     state: useState<boolean>(true),
  //     control: <Switch />,
  //   },
  //   crosshair: {
  //     label: 'Crosshair',
  //     state: useState<boolean>(true),
  //     control: <Switch />,
  //   },
  //   coords: {
  //     label: 'Show coordinates',
  //     state: useState<boolean>(false),
  //     control: <Switch />,
  //   },
  //   maxI: {
  //     label: 'Iterations',
  //     state: useState<number>(250),
  //     control: (
  //       <Slider
  //         min={5}
  //         max={1000}
  //         step={5}
  //         valueLabelDisplay="auto"
  //         marks={[
  //           { value: 5, label: 5 },
  //           { value: 250, label: 250 },
  //           { value: 500, label: 500 },
  //           { value: 750, label: 750 },
  //           { value: 1000, label: 1000 },
  //         ]}
  //       />
  //     ),
  //     labelPlacement: 'top',
  //   },
  //   // useAA: false,
  //   // useDPR: false,
  //   // showFPS: false,
  // };

  return (
    <SettingsContext.Provider value={[settings, setSettings, settingsWidgets]}>
      {children}
    </SettingsContext.Provider>
  );
};

// export const SettingsConsumer = ({ children }: { children: ReactNode }): JSX.Element => {
//   // const settings = {
//   //   minimap: useState(true),
//   // };
//   return <SettingsContext.Consumer>{children}</SettingsContext.Consumer>;
// };

export default SettingsProvider;

// export interface SettingsOptionProps {
//   label: string;
//   // state: [T, React.Dispatch<React.SetStateAction<T>>];
//   control: () => JSX.Element;
// }

// export const SettingsOption = (props: SettingsOptionProps): React.ReactElement => {
//   const a = props.label;
//   return (
//     <FormControlLabel
//       label={props.label}
//       control={<props.control />}
//       key={`${props.label.toLowerCase()}-control`}
//       // labelPlacement={ctrl.placement ? ctrl.placement : 'end'}
//     />
//   );
// };

// interface OptionToggleSwitchProps extends SwitchProps {
//   state: StateType<boolean>;
// }

// export const OptionToggleSwitch = (props: OptionToggleSwitchProps): JSX.Element => {
//   const [state, setState] = props.state;
//   return <Switch color="primary" checked={state} onChange={(e) => setState(e.target.checked)} {...props} />;
// };

// export interface SettingsGroupProps {
//   name: string;
// }

// export type SettingsControlType<T, C> = {
//   label: string;
//   state: [T, React.Dispatch<React.SetStateAction<T>>];
//   control: C;
// };

// export const SettingsControl = <T, C>(label: string, defaultValue: T, control: C): SettingsControlType<T, C> => ({
//   label: label,
//   state: useState(defaultValue),
//   control: control,
// });

// export default function SettingsGroup(props: any) {
//   // const s: OptionToggleSwitchProps = {
//   //   state: useState<boolean>(true),
//   //   disabled: true,
//   // };

//   const settings = {
//     minimap: useState(true),
//     crosshair: useState(true),
//     coords: useState(false),
//     maxI: useState(250),
//     aa: useState(false),
//     dpr: useState(false),
//     fps: useState(false),
//   };

//   const controls = [
//     {
//       name: 'Interface',
//       controls: {
//         minimap: {
//           label: 'Minimap',
//           state: useState(true),
//           control: <Switch />,
//         },
//         // crosshair: { v: true },
//         // coords: { v: true },
//       },
//     },
//     {
//       name: 'Interface',
//       controls: {
//         maxI: useState(250),
//         useAA: useState(false),
//         useDPR: useState(false),
//         fps: useState(false),
//       },
//     },
//   ];

//   const g = controls[0];

//   const GroupDivider = () => <Divider style={{ marginTop: 10, marginBottom: 4 }} />;

//   return (
//     <Grid item key={`${g.name}-control-group`}>
//       <GroupDivider />
//       <Typography variant="overline" style={{ fontSize: 14, marginBottom: 4 }}>
//         {g.name}
//       </Typography>
//       <FormGroup>
//         {/* <FormControlLabel label="Minimap" control={OptionToggleSwitch(controls.minimap)} /> */}
//         {Object.values(g.controls).map((ctrl) => {
//           // const [v, setV] = useState(ctrl.state);
//           return (
//             <FormControlLabel
//               label={ctrl.label}
//               key={`${ctrl.label}-control`}
//               // value={v}
//               // onChange={(e) => setV(e.target)}
//               control={ctrl.control}
//               // labelPlacement={ctrl.placement ? ctrl.placement : 'end'}
//               // style={
//               //   ctrl.placement
//               //     ? {
//               //         marginLeft: 0,
//               //         marginRight: 0,
//               //       }
//               //     : {}
//               // }
//             />
//           );
//         })}
//       </FormGroup>
//     </Grid>
//   );
// }

// export const settings = {};
