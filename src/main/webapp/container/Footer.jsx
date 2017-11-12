'use strict';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import {withStyles} from 'material-ui/styles';
import withWidth from 'material-ui/utils/withWidth';
import Paper from 'material-ui/Paper';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Tabs, { Tab } from 'material-ui/Tabs';
import {withRouter} from 'react-router-dom'

import {FaHome, FaCalendar, FaUser} from 'react-icons/lib/fa';

import blue from 'material-ui/colors/blue';

const drawerWidth = 240;

const styles = theme => ({
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
    marginLeft: drawerWidth,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  appBar2: {
    position: 'relative',
    [theme.breakpoints.up('sm')]: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
    },
    [theme.breakpoints.down('xs')]: {
      marginLeft: '0px',
      width: '100%',
    },
  },
  navIconHide: {
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  drawerHeader: theme.mixins.toolbar,
  drawerPaper: {
    width: 250,
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      position: 'relative',
      height: '100%',
    },
  },
  content: {
    backgroundColor: theme.palette.background.default,
    width: '100%',
    padding: theme.spacing.unit * 3,
    height: 'calc(100% - 56px)',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 64px)',
      marginTop: 64,
    },
  },
});

class Footer extends Component {

  handleChange = (event, value) => {
    const {history} = this.context.router;
    switch (value) {
      case 0:
        history.push('/');
        break;
      case 1:
        history.push('/courses/all');
        break;
      case 2:
        history.push('/profile');
        break;
      default:
        history.push('/');
    }
  };

  fromRoute() {
    const {location} = this.context.router.history;
    switch (location.pathname) {
      case '/':
        return 0;
      case '/courses/all':
        return 1;
      case '/profile':
        return 2;
      default:
        return -1;
    }
  }

  render() {
    const {classes} = this.props;
    const value = this.fromRoute();
    return (
      <Paper style={{position: 'absolute', bottom: '0px', left: '0px', width: '100%'}}>
        <div className={classes.appBar2}>
          <Tabs
            value={value}
            onChange={this.handleChange}
            fullWidth
            scrollable
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab icon={<FaHome size={28}/>}/>
            <Tab icon={<FaCalendar size={28}/>}/>
            <Tab icon={<FaUser size={28}/>}/>
          </Tabs>
        </div>
      </Paper>
    );
  };
}

Footer.contextTypes = {
  router: PropTypes.object.isRequired
};

export default compose(withRouter, withStyles(styles, {withTheme: true}), withWidth())(Footer);