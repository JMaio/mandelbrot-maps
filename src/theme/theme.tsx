import { colors, createMuiTheme, responsiveFontSizes } from '@material-ui/core';

let theme = createMuiTheme({
  props: {
    // Name of the component ⚛️
    MuiSwitch: {
      // The default props to change
      color: 'primary', // x, on the whole application 💣!
    },
    MuiButton: {
      variant: 'outlined',
      // style: {
      //   borderRadius: 24,
      // },
    },
  },
  palette: {
    primary: {
      main: colors.blue[700],
    },
    secondary: {
      main: colors.red[700],
    },
    info: {
      main: colors.blue[700],
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    h1: {
      fontSize: '3rem',
    },
    h2: {
      fontSize: '2rem',
    },
  },
});

theme = responsiveFontSizes(theme);

export const simpleBoxShadow = '0px 2px 10px 1px rgba(0, 0, 0, 0.4)';
export const lightBoxShadow = '0px 0px 10px 2px rgba(255, 255, 255, 0.8)';
export const darkBoxShadow = '0px 0px 10px 2px rgba(0, 0, 0, 0.8)';

/**
 * A box shadow comprised of two overlaid box shadows:
 * - a light box shadow (for contrasting against **dark** backgrounds)
 * - a dark box shadow (for contrasting against **light** backgrounds)
 */
export const contrastBoxShadow = `${lightBoxShadow}, ${darkBoxShadow}`;

export default theme;
