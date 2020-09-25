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

export default theme;
