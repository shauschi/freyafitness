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
import {Home, Courses, ProfileSite, AboutFreya, AboutLocation, Agb, Impressum, Logout} from "./sites";
import * as Style from './utils/Style.jsx';
import {actions as drawerActions} from './model/drawer';
import {
  fetchCourses,
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
    const {classes, drawer, actions, profile, courses} = this.props;
    return (
      <MuiThemeProvider theme={Style.APP_THEME}>
        <div className={classes.root}>
          <div className={classes.appFrame}>
            <MyAppBar classes={classes} toggleDrawer={actions.toggleDrawer} {...this.props}/>
            <MyDrawer classes={classes} toggleDrawer={actions.toggleDrawer} {...drawer}/>
            <div style={{
              marginTop: '56px',
              marginBottom: '46px',
              position: 'relative',
              width: '100%',
              height: 'calc(100% - 102px)'
            }}>
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
                  <Route exact path='/' render={() => <Home {...this.props}/>}/>
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
                  <Route exact path='/profile'
                         render={() => <ProfileSite pending={profile.pending} profile={profile.data}/>}/>
                </SwipeableRoutes>
              </Switch>
            </div>
            <Footer {...this.props}/>
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
  profile: state.profile,
  drawer: state.drawer,
  courses: state.courses,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    toggleDrawer: drawerActions.toggleDrawer,
    fetchCourses: fetchCourses,
    showCourseDetails: showCourseDetails,
    hideCourseDetails: hideCourseDetails,
    saveCourseDetails: saveCourseDetails,
    toggleAttendeeList: toggleAttendeeList,
    toggleEditCourse: toggleEditCourse,
    onCourseDetailsChange: onCourseDetailsChange,
    signIn: signIn,
    signOut: signOut
  }, dispatch),
  dispatch
});

export default compose(
  withRouter,
  withStyles(Style.APP_STYLES, {withTheme: true}),
  connect(mapStateToProps, mapDispatchToProps)
)(App);