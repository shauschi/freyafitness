'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';
import {withRouter} from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';

import {IconMenu, IconPreferences} from '../utils/Icons';
import {PRIMARY, PRIMARY_FONT} from '../utils/Style';

class MyAppBar extends Component {

  state = {
    anchor: null
  };

  getLoginButton = () => {
    const {scrollToLogin} = this.props;
    return (
      <Button
        color='inherit'
        onClick={scrollToLogin}
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

  render() {
    const {classes, toggleDrawer} = this.props;

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
          {this.getAdditionalAction()}
        </Toolbar>
        {this.getMenu()}
      </AppBar>
  );
  };

  getMenu = () => {
    const {anchor} = this.state;
    const {createCourse} = this.props;
    return <Menu
      open={!!anchor}
      anchorEl={anchor}
      onClose={this.closeMenu}
      >
      <MenuItem onClick={() => {this.closeMenu(); createCourse()}}>Kurs anlegen</MenuItem>
      <MenuItem onClick={this.closeMenu}>News anlegen (folgt)</MenuItem>
      <MenuItem onClick={this.closeMenu}>Admin (folgt)</MenuItem>
    </Menu>
  };
}

export default compose(
  withRouter,
  withWidth()
)(MyAppBar);