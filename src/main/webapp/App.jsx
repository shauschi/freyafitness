'use strict';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {MuiThemeProvider, withStyles} from 'material-ui/styles';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom'
import {MyAppBar, Footer, MyDrawer} from './container';
import SwipeableRoutes from 'react-swipeable-routes';
import Snackbar, {SnackbarContent} from 'material-ui/Snackbar';
import {Home, Courses, ProfileSite, AboutFreya, AboutLocation, Agb, Impressum, Logout} from "./sites";
import * as Style from './utils/Style';
import {
  toggleDrawer
} from './model/drawer';
import {
  hideNotification
} from './model/notification';
import {
  fetchCourses,
  createCourse,
  showCourseDetails,
  hideCourseDetails,
  saveCourseDetails,
  toggleAttendeeList,
  toggleEditCourse,
  onCourseDetailsChange,
  signIn,
  signOut
} from './model/courses';
import init from './model/init.js';

class App extends Component {

  componentDidMount() {
    const {dispatch} = this.props;
    init(dispatch);
  };

  render() {
    const {classes, drawer, actions, courses, news, notification} = this.props;
    return (
      <MuiThemeProvider theme={Style.APP_THEME}>
        <div className={classes.root}>
          <div className={classes.appFrame} style={{backgroundImage: 'url(' + __API__ + '/background.jpg)', backgroundSize: 'cover'}}>
            <MyAppBar
              classes={classes}
              toggleDrawer={actions.toggleDrawer}
              createCourse={actions.createCourse}
              {...this.props}/>
            <MyDrawer classes={classes} toggleDrawer={actions.toggleDrawer} {...drawer}/>
            <div className={classes.content}>
              <Switch>
                <Redirect from='/index' to='/'/>
                <Redirect from='/home' to='/'/>
                <Route exact path='/about/freya' render={() => <AboutFreya {...this.props}/>}/>
                <Route exact path='/about/stall' render={() => <AboutLocation {...this.props}/>}/>
                <Route exact path='/agb' render={() => <Agb {...this.props}/>}/>
                <Route exact path='/impressum' render={() => <Impressum{...this.props}/>}/>
                <Route exact path='/logout' render={() => <Logout {...this.props}/>}/>
                <SwipeableRoutes
                  resistance
                  style={{height: '100%'}}
                  containerStyle={{
                    height: '100%',
                    WebkitOverflowScrolling: 'touch',
                  }}
                >
                  <Route exact path='/' render={() =>
                    <Home
                      {...this.props}
                      news={news}
                    />}
                  />
                  <Route exact path='/courses/all' render={() =>
                    <Courses
                      pending={courses.pending}
                      courses={courses.data}
                      showCourseDetails={actions.showCourseDetails}
                      hideCourseDetails={actions.hideCourseDetails}
                      saveCourseDetails={actions.saveCourseDetails}
                      courseDetails={courses.courseDetails}
                      toggleAttendeeList={actions.toggleAttendeeList}
                      toggleEditCourse={actions.toggleEditCourse}
                      onCourseDetailsChange={actions.onCourseDetailsChange}
                      signIn={actions.signIn}
                      signOut={actions.signOut}
                    />}
                  />
                  <Route exact path='/profile' render={() => <ProfileSite/>}/>
                </SwipeableRoutes>
              </Switch>
            </div>
            <Footer {...this.props}/>
            <Snackbar
              open={notification.show}
              onClose={this.props.actions.hideNotification}
              message={notification.message}
              autoHideDuration={1500}/>
          </div>
        </div>
      </MuiThemeProvider>
    );
  };
}

App.contextTypes = {
  router: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  drawer: state.drawer,
  courses: state.courses,
  news: state.news,
  notification: state.notification,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    toggleDrawer: toggleDrawer,
    fetchCourses: fetchCourses,
    createCourse: createCourse,
    showCourseDetails: showCourseDetails,
    hideCourseDetails: hideCourseDetails,
    saveCourseDetails: saveCourseDetails,
    toggleAttendeeList: toggleAttendeeList,
    toggleEditCourse: toggleEditCourse,
    onCourseDetailsChange: onCourseDetailsChange,
    signIn: signIn,
    signOut: signOut,
    hideNotification: hideNotification
  }, dispatch),
  dispatch
});

export default compose(
  withRouter,
  withStyles(Style.APP_STYLES, {withTheme: true}),
  connect(mapStateToProps, mapDispatchToProps)
)(App);