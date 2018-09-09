'use strict';
import {blueGrey, green, lightBlue, red} from '@material-ui/core/colors';
import {createMuiTheme} from '@material-ui/core/styles';

export const PRIMARY = '#00B0DB';
export const SECONDARY = '#b000db';
export const PRIMARY_FONT = '#FFFFFF';

export const TITLE_BG = PRIMARY;

export const APP_THEME = createMuiTheme({
  palette: {
    primary: {
      main: PRIMARY,
      contrastText: PRIMARY_FONT
    },
    secondary: {
      main: SECONDARY
    },
    error: red,
  }
});

export const DRAWER_WIDTH = 240;

export const APP_STYLES = theme => ({
  root: {
    width: '100%',
    paddingTop: '56px',
    paddingBottom: '56px',
    zIndex: 1,
    WebkitOverflowScrolling: 'touch',
    [theme.breakpoints.up('sm')]: {
      paddingTop: '64px',
      paddingBottom: '64px'
    },
  },
  drawerHeader: theme.mixins.toolbar,
  drawerPaper: {
    width: DRAWER_WIDTH + 10
  },
  courseCell: {
    padding: '4px 16px'
  }
});

export const getTextColorForBg = (bgColor, lightColor, darkColor) => {
  const color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
  const r = parseInt(color.substring(0, 2), 16); // hexToR
  const g = parseInt(color.substring(2, 4), 16); // hexToG
  const b = parseInt(color.substring(4, 6), 16); // hexToB
  const uicolors = [r / 255, g / 255, b / 255];
  const c = uicolors.map((col) => {
    if (col <= 0.03928) {
      return col / 12.92;
    }
    return Math.pow((col + 0.055) / 1.055, 2.4);
  });
  const L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
  return (L > 0.179) ? darkColor : lightColor;
}