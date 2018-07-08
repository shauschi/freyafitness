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
    paddingTop: '64px',
    paddingBottom: '64px',
    zIndex: 1,
    WebkitOverflowScrolling: 'touch'
  },
  drawerHeader: theme.mixins.toolbar,
  drawerPaper: {
    width: DRAWER_WIDTH + 10
  },
  courseCell: {
    padding: '4px 16px'
  }
});