'use strict';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {MuiThemeProvider, withStyles} from '@material-ui/core/styles';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import {Redirect, Route, Switch, withRouter} from 'react-router-dom';
import {Footer, MyAppBar, MyDrawer} from './container';
import SwipeableRoutes from 'react-swipeable-routes';
import {CustomizedSnackbar, LoadingIndicator} from './components/general';
import {About, Agb, Courses, Home, Impressum, ProfileSite} from './sites';
import {CourseDetails} from './components/course';
import * as Style from './utils/Style';
import {toggleDrawer} from './model/drawer';
import {hideNotification} from './model/notification';
import {createCourse} from './model/courses';
import {login, logout, scrollToLogin} from './model/profile';
import init from './model/init.js';

const HOME_ROUTE = <Route exact path='/' component={Home}/>;
const SWIPEABLE_ROUTE = <SwipeableRoutes
  resistance
  style={{height: '100%'}}
  containerStyle={{
    height: '100%',
    WebkitOverflowScrolling: 'touch',
  }}
>
  {HOME_ROUTE}
  <Route exact path='/courses/all' component={Courses}/>
  <Route exact path='/profile' component={ProfileSite}/>
</SwipeableRoutes>;


class App extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {dispatch} = this.props;
    init(dispatch);
  };

  render() {
    const {classes, drawer, actions, profile, notification} = this.props;
    const currentUser = profile.user;

    return (
      <MuiThemeProvider theme={Style.APP_THEME}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <MyAppBar
            pending={profile.pending}
            classes={classes}
            toggleDrawer={actions.toggleDrawer}
            createCourse={actions.createCourse}
            scrollToLogin={actions.scrollToLogin}
            currentUser={currentUser}
            {...this.props}/>
          <div style={{position: 'absolute'}}>
            {/* All Dialogs */}
            <CourseDetails/>
          </div>
          <MyDrawer
            classes={classes}
            logout={actions.logout}
            toggleDrawer={actions.toggleDrawer}
            currentUser={currentUser}
            {...drawer}/>
          {
            profile.pending
              ? <LoadingIndicator/>
              : <Switch>
                <Redirect from='/index' to='/'/>
                <Redirect from='/home' to='/'/>
                <Route exact path='/about' render={() => <About {...this.props}/>}/>
                <Route exact path='/agb' render={() => <Agb {...this.props}/>}/>
                <Route exact path='/impressum' render={() => <Impressum{...this.props}/>}/>
                {
                  currentUser
                    ? SWIPEABLE_ROUTE
                    : HOME_ROUTE
                }
              </Switch>
          }
          {
            currentUser
              ? <Footer {...this.props}/>
              : undefined
          }
          <CustomizedSnackbar
            open={notification.show}
            variant={notification.variant}
            message={notification.message}
            onClose={this.props.actions.hideNotification}
            autoHideDuration={notification.autoHideDuration}/>
        </MuiPickersUtilsProvider>
      </MuiThemeProvider>
    );
  };
}

App.contextTypes = {
  router: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  courses: state.courses,
  drawer: state.drawer,
  news: state.news,
  profile: state.profile,
  notification: state.notification
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    createCourse: createCourse,
    scrollToLogin: scrollToLogin,
    login: login,
    logout: logout,
    toggleDrawer: toggleDrawer,
    hideNotification: hideNotification
  }, dispatch),
  dispatch
});

export default compose(
  withRouter,
  withStyles(Style.APP_STYLES, {withTheme: true}),
  connect(mapStateToProps, mapDispatchToProps)
)(App);