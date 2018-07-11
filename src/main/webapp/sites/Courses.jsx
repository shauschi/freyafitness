'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Grid from '@material-ui/core/Grid';
import {CourseDetails, CourseList} from './../components/course';
import {showCourseDetails, signIn, signOut} from './../model/courses';
import {withStyles} from "@material-ui/core/styles/index";
import * as Style from "../utils/Style";

class Courses extends Component {
  render() {
    const {
      courses,
      actions
    } = this.props;
    const {showCourseDetails, signIn, signOut} = actions;
    const {data} = courses;
    return (
      <div className={this.props.classes.root}>
        <Grid container spacing={16} justify="center" style={{width: '100%', margin: '0px'}}>
          <CourseDetails/>
          <Grid item xs={12} sm={10} md={8} lg={6} style={{padding: '0px'}}>
            <CourseList courses={data} showCourseDetails={showCourseDetails} signIn={signIn} signOut={signOut}/>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  courses: state.courses
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    // courses
    showCourseDetails: showCourseDetails,
    signIn: signIn,
    signOut: signOut
  }, dispatch),
  dispatch
});

export default compose(
  withStyles(Style.APP_STYLES, {withTheme: true}),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Courses);