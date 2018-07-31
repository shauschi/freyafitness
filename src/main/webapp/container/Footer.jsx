'use strict';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import {withRouter} from 'react-router-dom';
import {IconCalendar, IconHome, IconUser, IconPreferences} from '../utils/Icons';

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
      case 3:
        history.push('/preferences');
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
      case '/preferences':
        return 3;
      default:
        return false;
    }
  }

  render() {
    const value = this.fromRoute();
    return (
      <BottomNavigation
        value={value}
        onChange={this.handleChange}
        style={{position: 'fixed', bottom: '0px', width: '100%', zIndex: 1000}}>
        <BottomNavigationAction label="Home" icon={<IconHome size={24}/>}/>
        <BottomNavigationAction label="Kurse" icon={<IconCalendar size={24}/>}/>
        <BottomNavigationAction label="Profil" icon={<IconUser size={24}/>}/>
        <BottomNavigationAction label="Einstellungen" icon={<IconPreferences size={24}/>}/>
      </BottomNavigation>
    );
  };
}

Footer.contextTypes = {
  router: PropTypes.object.isRequired
};

export default compose(
  withRouter
)(Footer);