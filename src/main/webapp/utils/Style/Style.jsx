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
    marginLeft: DRAWER_WIDTH,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${DRAWER_WIDTH}px)`,
    },
  },
  appBar2: {
    position: 'relative',
    marginLeft: '0px',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: DRAWER_WIDTH,
      width: `calc(100% - ${DRAWER_WIDTH}px)`,
    }
  },
  navIconHide: {
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  drawerHeader: theme.mixins.toolbar,
  drawerPaper: {
    width: DRAWER_WIDTH + 10,
    [theme.breakpoints.up('sm')]: {
      width: DRAWER_WIDTH,
      position: 'relative',
      height: '100%',
    },
  },
  content: {
    position: 'relative',
    width: '100%',
    height: 'calc(100% - 102px)',
    marginTop: '55px',
    marginBottom: '46px',
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 110px)',
      marginTop: '64px',
      width: `calc(100% - ${DRAWER_WIDTH}px)`
    },
  },
  contentScroll: {
    position: 'relative',
    width: '100%',
    marginTop: '55px',
    overflow: 'scroll',
    [theme.breakpoints.up('sm')]: {
      marginTop: '64px',
      width: `calc(100% - ${DRAWER_WIDTH}px)`
    },
  }
});