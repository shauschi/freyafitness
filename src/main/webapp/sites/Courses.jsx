'use strict';
import React, {Component} from 'react';
import Grid from 'material-ui/Grid';
import List from 'material-ui/List';
import Course, {CourseDetails} from './../components/course';

class Courses extends Component {
  render() {
    const {courses, showCourseDetails, hideCourseDetails, courseDetails} = this.props;
    return (
      <Grid container spacing={16} justify="center" style={{width: '100%'}}>
        <CourseDetails
          courseDetails={courseDetails}
          onRequestClose={hideCourseDetails}
        />
        <Grid item xs={12} md={12}>
          <List>
          {
            courses.map((course, idx) => (
              <Course key={idx} course={course} showCourseDetails={showCourseDetails}/>
            ))
          }
          </List>
        </Grid>
      </Grid>
    );
  }
}

export default Courses;