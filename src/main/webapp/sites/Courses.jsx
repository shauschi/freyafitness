'use strict';
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Grid from 'material-ui/Grid';
import {CourseDetails, CourseList} from './../components/course';
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
} from './../model/courses';

class Courses extends Component {
  render() {
    const {
      courses,
      actions
    } = this.props;
    const {
      showCourseDetails,
      saveCourseDetails,
      hideCourseDetails,
      toggleAttendeeList,
      toggleEditCourse,
      onCourseDetailsChange,
      signIn,
      signOut
    } = actions;
    const {courseDetails, data, pending} = courses;

    return (
      <Grid container spacing={16} justify="center" style={{width: '100%', margin: '0px'}}>
        <CourseDetails
          mode={courseDetails.mode}
          show={courseDetails.show}
          pending={pending}
          showAttendees={courseDetails.showAttendees}
          course={courseDetails.course}
          onClose={hideCourseDetails}
          onSave={saveCourseDetails}
          toggleAttendeeList={toggleAttendeeList}
          toggleEditCourse={toggleEditCourse}
          onCourseDetailsChange={onCourseDetailsChange}
          signIn={signIn}
          signOut={signOut}
        />
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

  }, dispatch),
  dispatch
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Courses);