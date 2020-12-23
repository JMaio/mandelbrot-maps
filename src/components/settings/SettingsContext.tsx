import React, { createContext, ReactNode, useState } from 'react';
import {
  defaultSettings,
  SettingsContextType,
  settingsDefinitionsType,
} from '../../common/settings';
import { settingsWidgets } from './SettingsDefinitions';

export const SettingsContext = createContext<SettingsContextType>({
  // provide the context with the default values
  settings: defaultSettings,
  // can't set state until it's initialized
  setSettings: () => {
    return;
  },
  settingsWidgets: settingsWidgets(defaultSettings),
});

// export const useSettings = (): SettingsContextType => useContext(SettingsContext);

export const SettingsProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  // https://reactjs.org/docs/context.html#updating-context-from-a-nested-component
  // no grouping: all settings are accessible
  const [settings, setSettings] = useState<settingsDefinitionsType>(defaultSettings);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setSettings,
        settingsWidgets: settingsWidgets(settings),
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
