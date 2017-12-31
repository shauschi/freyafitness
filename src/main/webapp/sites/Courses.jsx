'use strict';
import React, {Component} from 'react';
import Grid from 'material-ui/Grid';
import {CourseDetails, CourseList} from './../components/course';

class Courses extends Component {
  render() {
    const {courses, showCourseDetails, hideCourseDetails, courseDetails, toggleAttendeeList, toggleEditCourse, signIn, signOut} = this.props;
    return (
      <Grid container spacing={16} justify="center" style={{width: '100%', margin: '0px'}}>
        <CourseDetails
          courses={courses}
          courseDetails={courseDetails}
          onRequestClose={hideCourseDetails}
          toggleAttendeeList={toggleAttendeeList}
          toggleEditCourse={toggleEditCourse}
          signIn={signIn}
          signOut={signOut}
        />
        <Grid item xs={12} md={12} style={{padding: '0px'}}>
          <CourseList courses={courses} showCourseDetails={showCourseDetails}/>
        </Grid>
      </Grid>
    );
  }
}

export default Courses;