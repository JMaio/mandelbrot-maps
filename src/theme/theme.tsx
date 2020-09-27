import { createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
  props: {
    // Name of the component ⚛️
    MuiSwitch: {
      // The default props to change
      color: 'primary', // x, on the whole application 💣!
    },
  },
});

export const simpleBoxShadow = '0px 2px 10px 1px rgba(0, 0, 0, 0.4)';

export default theme;
