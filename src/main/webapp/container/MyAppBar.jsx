import React, {Component} from 'react';
import compose from 'recompose/compose';
import withWidth from 'material-ui/utils/withWidth';
import {withRouter} from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Menu, {MenuItem} from 'material-ui/Menu';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import Hidden from 'material-ui/Hidden';

import {
  IconMenu,
  IconPreferences
} from '../utils/Icons';
import {blueGrey} from 'material-ui/colors';

class MyAppBar extends Component {

  state = {
    anchor: null
  };

  getLoginButton = () => {
    const {scrollToLogin} = this.props;
    return (
      <Button
        onClick={scrollToLogin}
        color={'primary'}
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
        color='contrast'
        ariaLabel='Neuen Kurs anlegen'
        onClick={this.openMenu}
        style={{marginLeft: '20px', marginRight: '-12px'}}>
        <IconPreferences/>
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

  render() {
    const {classes, toggleDrawer} = this.props;

    return (
      <div style={{flexGrow: 1}}>
        <AppBar style={{background: blueGrey[800]}} className={classes.appBar}>
          <Toolbar>
          <Hidden smUp>
            <IconButton
              color='contrast'
              aria-label='Navigation'
              onClick={toggleDrawer}
              style={{marginLeft: '-12px', marginRight: '20px'}}
            >
              <IconMenu/>
            </IconButton>
          </Hidden>
          <Typography type='title' style={{flex: 1, textAlign: 'center'}}>
            <span style={{
              color: 'white',
              fontSize: '31px',
              fontWeight: 'bold',
              textShadow: '-2px -2px 0px #444'
            }}>freya</span>
            <span style={{
              color: '#03a9f4',
              fontSize: '42px',
              fontWeight: 'bold',
              textShadow: '-2px -2px 0px #444'
            }}>.</span>
            <span style={{
              color: 'white',
              fontSize: '31px',
              fontWeight: 'bold',
              textShadow: '-2px -2px 0px #444'
            }}>fitness</span>
            <Hidden xsDown>
              <span style={{color: 'white'}}> - Willkommen beim Fitnessprogramm mit Freya</span>
            </Hidden>
          </Typography>
          {this.getAdditionalAction()}
        </Toolbar>
        </AppBar>
        {this.getMenu()}
      </div>
    );
  };
}

export default compose(
  withRouter,
  withWidth()
)(MyAppBar);