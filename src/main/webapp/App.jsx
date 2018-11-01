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
import { TransitionGroup, CSSTransition as OriginalCSSTransition } from 'react-transition-group';
import {Footer, MyAppBar, MyDrawer} from './container';
import {CustomizedSnackbar, LoadingIndicator} from './components/general';
import {
  AboutCourses,
  AboutFreya,
  AboutFreyRaum,
  Agb,
  Courses,
  Memberships,
  Home,
  Impressum,
  ProfileSite,
  Preferences,
  Statistics
} from './sites';
import {CourseDetails, CreateCourse} from './components/course';
import {CreateMembership, MembershipDetails} from './components/membership';
import * as Style from './utils/Style';
import {toggleDrawer} from './model/drawer';
import {hideNotification} from './model/notification';
import {createCourse} from './model/courses';
import {showCreateMembership} from './model/memberships';
import {login, logout, scrollToLogin} from './model/profile';
import init from './model/init.js';

class CSSTransition extends OriginalCSSTransition {
  onEntered = () => {
    // Do not remove enter classes when active
  }
}

class App extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {dispatch} = this.props;
    init(dispatch);
  };

  componentWillReceiveProps(nextProps) {
    this.previousView = this.props.location;
  }

  render() {
    const {classes, drawer, actions, profile, notification, location} = this.props;
    const currentUser = profile.user;

    const modal = location.state && location.state.to === 'modal';

    let pos = {};
    let title = {};
    if (modal){
      pos = location.state.from;
      title = location.state.title;
    }

    return (
      <MuiThemeProvider theme={Style.APP_THEME}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <div>
          <MyAppBar
            pending={profile.pending}
            classes={classes}
            toggleDrawer={actions.toggleDrawer}
            createMembership={actions.showCreateMembership}
            scrollToLogin={actions.scrollToLogin}
            currentUser={currentUser}
            {...this.props}/>
          <div style={{position: 'absolute'}}>
            {/* All Dialogs ... TODO remove all dialogs */}
            <CreateMembership/>
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
                  <Redirect from='/index' to='/home'/>
                  <Redirect exact from='/' to='/home'/>
                  <Route exact path='/about/freya' render={() => <AboutFreya {...this.props}/>}/>
                  <Route exact path='/about/freyraum' render={() => <AboutFreyRaum {...this.props}/>}/>
                  <Route exact path='/about/courses' render={() => <AboutCourses {...this.props}/>}/>
                  <Route exact path='/agb' render={() => <Agb {...this.props}/>}/>
                  <Route exact path='/impressum' render={() => <Impressum{...this.props}/>}/>
                  <Route path='/home' component={Home}/>
                  <Route exact path='/statistics' component={Statistics}/>
                  <Route path='/courses' component={Courses}/>
                  <Route path='/memberships' component={Memberships}/>
                  <Route exact path='/profile' component={ProfileSite}/>
                  <Route exact path='/preferences' component={Preferences}/>
                </Switch>
          }
          {
            <TransitionGroup>
              <CSSTransition
                timeout={800}
                classNames="modal"
                key={location.pathname}
                mountOnEnter
                unmountOnExit
                appear
              >
                <Switch location={location}>
                  <Route exact path='/**/membership/:id' component={MembershipDetails}/>
                  <Route exact path='/**/course/:id' render={props => <CourseDetails style={pos} titleElement={title} {...props}/>}/>
                </Switch>
              </CSSTransition>
            </TransitionGroup>
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
          </div>
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
    hideNotification: hideNotification,
    // membership
    showCreateMembership: showCreateMembership
  }, dispatch),
  dispatch
});

export default compose(
  withRouter,
  withStyles(Style.APP_STYLES, {withTheme: true}),
  connect(mapStateToProps, mapDispatchToProps)
)(App);