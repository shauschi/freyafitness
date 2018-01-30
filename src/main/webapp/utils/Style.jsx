'use strict';

import {green, lightBlue, red} from "material-ui/colors/index";
import {createMuiTheme} from "material-ui/styles/index";

export const APP_THEME = createMuiTheme({
  palette: {
    primary: lightBlue,
    secondary: green,
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
    position: 'absolute',
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
    backgroundColor: theme.palette.background.default,
    width: '100%',
    height: 'calc(100% - 102px)',
    marginTop: '56px',
    marginBottom: '46px',
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 110px)',
      marginTop: 64,
      width: `calc(100% - ${DRAWER_WIDTH}px)`
    },
  },
});