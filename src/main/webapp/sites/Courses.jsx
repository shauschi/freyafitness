'use strict';
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Grid from '@material-ui/core/Grid';
import {CourseDetails, CourseList} from './../components/course';
import {showCourseDetails} from './../model/courses';

class Courses extends Component {
  render() {
    const {
      courses,
      actions
    } = this.props;
    const {showCourseDetails} = actions;
    const {data} = courses;
    return (
      <Grid container spacing={16} justify="center" style={{width: '100%', margin: '0px'}}>
        <CourseDetails/>
        <Grid item xs={12} md={12} style={{padding: '0px'}}>
          <CourseList courses={data} showCourseDetails={showCourseDetails}/>
        </Grid>
      </Grid>
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
  }, dispatch),
  dispatch
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Courses);