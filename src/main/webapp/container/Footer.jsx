'use strict';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import {withStyles} from 'material-ui/styles';
import withWidth from 'material-ui/utils/withWidth';
import Paper from 'material-ui/Paper';
import Tabs, { Tab } from 'material-ui/Tabs';
import {withRouter} from 'react-router-dom'
import * as Style from '../utils/Style.jsx';
import {FaHome, FaCalendar, FaUser} from 'react-icons/lib/fa';

import {blueGrey} from 'material-ui/colors';

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
        return false;
    }
  }

  render() {
    const {classes} = this.props;
    const value = this.fromRoute();
    return (
      <Paper style={{position: 'absolute', bottom: '0px', left: '0px', width: '100%', background: blueGrey.A700}}>
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

export default compose(
  withRouter,
  withStyles(Style.APP_STYLES, {withTheme: true}),
  withWidth())(Footer);