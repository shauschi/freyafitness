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
    height: '100%',
    marginTop: 0,
    zIndex: 1,
    overflow: 'hidden',
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  appBar: {
    position: 'fixed',
    marginLeft: DRAWER_WIDTH
  },
  drawerHeader: theme.mixins.toolbar,
  drawerPaper: {
    width: DRAWER_WIDTH + 10
  },
  content: {
    position: 'relative',
    width: '100%',
    height: 'calc(100% - 102px)',
    marginTop: '55px',
    marginBottom: '46px'
  },
  contentScroll: {
    position: 'relative',
    width: '100%',
    marginTop: '55px',
    overflow: 'scroll'
  }
});