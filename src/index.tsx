import { ThemeProvider } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ServiceWorkerWrapper from './components/ServiceWorkerWrapper';
import SettingsProvider, { SettingsContext } from './components/settings/SettingsContext';
import './index.css';
import theme from './theme/theme';
// import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ServiceWorkerWrapper />
      <SettingsProvider>
        <SettingsContext.Consumer>
          {({ settings }) => <App settings={settings} />}
        </SettingsContext.Consumer>
      </SettingsProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// The default service worker is not used: it's overridden instead
// by the ServiceWorkerWrapper (ServiceWorkerWrapper.tsx)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.register();
