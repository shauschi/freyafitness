'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import {withRouter} from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

import {IconPreferences} from '../utils/Icons';
import PropTypes from "prop-types";

class MyAppBar extends Component {

  state = {
    anchor: null
  };

  getLoginButton = () => {
    const {scrollToLogin} = this.props;
    return (
      <Button
        color='inherit'
        onClick={() => {scrollToLogin(this.context.router);}}
        style={{
          position: 'absolute',
          right: '0px',
          padding: '0 16px',
          zIndex: 20
        }}>
        Login
      </Button>
    );
  };

  getAdditionalAction = () => {
    if (this.props.pending) {
      return undefined;
    }
    if (!this.props.currentUser) {
      return this.getLoginButton();
    }

    const roles = this.props.currentUser.roles;
    if (roles.ADMIN || roles.TRAINER) {
      return <IconButton
        color='default'
        aria-label='Einstellungen'
        onClick={this.openMenu}
        style={{position: 'absolute', right: '8px', zIndex: 20}}>
        <IconPreferences size={28}/>
      </IconButton>;
    }
  };

  openMenu = event => {
    this.setState({anchor: event.currentTarget});
  };

  closeMenu = () => {
    this.setState({anchor: null});
  };

  getMenu = () => {
    const {anchor} = this.state;
    const {createMembership, history, location} = this.props;
    return <Menu
      open={!!anchor}
      anchorEl={anchor}
      onClose={this.closeMenu}
    >
      <MenuItem onClick={() => {this.closeMenu(); history.push(location.pathname + '/course/new')}}>Kurs anlegen</MenuItem>
      <MenuItem onClick={() => {this.closeMenu(); createMembership()}}>Mitgliedschaft anlegen</MenuItem>
      <MenuItem onClick={this.closeMenu}>News anlegen (folgt)</MenuItem>
      <MenuItem onClick={this.closeMenu}>Admin (folgt)</MenuItem>
    </Menu>
  };

  render() {
    const {toggleDrawer} = this.props;

    return (
      <AppBar color='primary'>
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='Navigation'
            onClick={toggleDrawer}
            style={{position: 'absolute', left: '8px', zIndex: 20}}
          >
            <img src='/logo.png' width={42} />
          </IconButton>
          <Typography type='title' color='inherit' style={{marginTop: '4px', width: '100%', textAlign: 'center'}}>
            <span style={{
              fontSize: '31px',
              fontWeight: 'lighter'
            }}>FREY</span>
            <span style={{
              fontSize: '31px',
              fontWeight: 'bold'
            }}>RAUM</span>
          </Typography>
          {
            'development' === process.env.NODE_ENV
              ? <div style={{position: 'absolute', textAlign: 'center', left: '0px', width: '100%', transform: 'rotate(-10deg)'}}>
                  <Typography color='secondary' variant='display1'>
                    Testumgebung
                  </Typography>
                </div>
              : undefined
          }

          {this.getAdditionalAction()}
        </Toolbar>
        {this.getMenu()}
      </AppBar>
    );
  };
}

MyAppBar.contextTypes = {
  router: PropTypes.object.isRequired
};

export default compose(
  withRouter,
)(MyAppBar);