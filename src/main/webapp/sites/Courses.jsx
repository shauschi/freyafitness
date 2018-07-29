'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Course, {CourseDetails} from './../components/course';
import {showCourseDetails, signIn, signOut} from './../model/courses';
import {withStyles} from '@material-ui/core/styles/index';
import * as Style from './../utils/Style';
import moment from 'moment';
import {Subheader} from './../components/general';
import List from '@material-ui/core/List';
import {comparingMod} from './../utils/Comparator';
import * as Format from './../utils/Format';

const compareCourseByStartDate = comparingMod('start', moment);

class Courses extends Component {

  getCourses = () => {
    const {
      courses,
      actions
    } = this.props;
    const {showCourseDetails, signIn, signOut} = actions;
    const {data} = courses;

    const elements = [];
    let courseElements = [];
    data.sort(compareCourseByStartDate);
    let lastFormatted = undefined;
    let lastMonth = undefined;
    for (const idx in data) {
      const course = data[idx];
      const formattedDayOfCourse = moment(course.start).format(Format.DAY_OF_WEEK_DATE_FORMAT);
      const formattedMonth = moment(course.start).format(Format.MONTH_FORMAT);
      if (lastMonth !== formattedMonth && lastMonth !== undefined) {
        elements.push(
          <Grid item xs={12} sm={10} md={6} lg={4} key={lastMonth}>
            <Card>
              <CardHeader title={lastMonth}/>
              <CardContent style={{padding: '0px'}}>
                <List>
                  {courseElements}
                </List>
              </CardContent>
            </Card>
          </Grid>
        );
        courseElements = [];
      }
      lastMonth = formattedMonth;

      if (lastFormatted !== formattedDayOfCourse) {
        courseElements.push(
          <Subheader key={formattedDayOfCourse} label={formattedDayOfCourse} />
        );
      }
      lastFormatted = formattedDayOfCourse;

      courseElements.push(
        <Course
          key={idx}
          course={course}
          showCourseDetails={showCourseDetails}
          signIn={signIn}
          signOut={signOut}/>
      );
    }
    elements.push(
      <Grid item xs={12} sm={10} md={6} lg={4}>
        <Card>
          <CardHeader title={lastMonth}/>
          <CardContent style={{padding: '0px'}}>
            <List>
              {courseElements}
            </List>
          </CardContent>
        </Card>
      </Grid>
    );

    return (<Grid container spacing={16} justify='center' style={{width: '100%', margin: '0px'}}>
      {elements}
    </Grid>);
  };


  render() {
    return (
      <div className={this.props.classes.root}>
        <CourseDetails/>
        {this.getCourses()}
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