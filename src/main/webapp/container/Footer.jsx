'use strict';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import {withStyles} from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import {withRouter} from 'react-router-dom';
import * as Style from '../utils/Style';
import {IconHome, IconCalendar, IconUser} from '../utils/Icons';

import {blueGrey} from '@material-ui/core/colors';

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
      <Paper style={{position: 'absolute', bottom: '0px', left: '0px', width: '100%', background: blueGrey[800]}}>
        <div className={classes.appBar2}>
          <Tabs
            value={value}
            onChange={this.handleChange}
            fullWidth
            scrollable
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab icon={<IconHome size={28}/>}/>
            <Tab icon={<IconCalendar size={28}/>}/>
            <Tab icon={<IconUser size={28}/>}/>
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