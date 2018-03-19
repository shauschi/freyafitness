import React, {Component} from 'react';
import compose from 'recompose/compose';
import withWidth from 'material-ui/utils/withWidth';
import {withRouter} from 'react-router-dom'
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import Hidden from 'material-ui/Hidden';
import {FadeIconButton} from './../components/general';

import {
  IconMenu,
  IconPlus
} from '../utils/Icons';
import {blueGrey} from 'material-ui/colors';

class MyAppBar extends Component {

  constructor(props) {
    super(props);
    this.getAddCourseButton = this.getAddCourseButton.bind(this);
    this.getLoginButton = this.getLoginButton.bind(this);
  }

  getAddCourseButton() {
    const {createCourse, location} = this.props;
    const inProp = location.pathname === '/courses/all';

    return (<FadeIconButton
      inProp={inProp}
      color='contrast'
      ariaLabel='Neuen Kurs anlegen'
      onClick={createCourse}
      style={{
        position: 'absolute',
        right: '0px',
        padding: '0 16px'
      }}>
      <IconPlus/>
    </FadeIconButton>);
  }

  getLoginButton() {
    const {login} = this.props;
    return (
      <Button
        onClick={login}
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
  }

  render() {
    const {classes, toggleDrawer, currentUser} = this.props;

    return (
      <AppBar style={{background: blueGrey[800]}} className={classes.appBar}>
        <Toolbar>
          <Hidden smUp>
            <IconButton
              color='contrast'
              aria-label='Navigation'
              onClick={toggleDrawer}
              style={{zIndex: 20}}
            >
              <IconMenu/>
            </IconButton>
          </Hidden>
          <Typography
            type='title'
            style={{
              zIndex: 10,
              position: 'absolute',
              left: 0,
              width: '100%',
              textAlign: 'center'}}>
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
          {
            currentUser
              ? this.getAddCourseButton()
              : this.getLoginButton()
          }
        </Toolbar>
      </AppBar>
    );
  };
}

export default compose(
  withRouter,
  withWidth()
)(MyAppBar);