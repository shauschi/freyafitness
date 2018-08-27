'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Grid from '@material-ui/core/Grid';
import Course, {CourseDetails} from './../components/course';
import {showCourseDetails, fetchCourses, signIn, signOut} from './../model/courses';
import {withStyles} from '@material-ui/core/styles/index';
import * as Style from './../utils/Style';
import {IconExpandMore} from './../utils/Icons';
import moment from 'moment';
import {Subheader} from './../components/general';
import List from '@material-ui/core/List';
import {comparingMod} from './../utils/Comparator';
import * as Format from './../utils/Format';
import {PullToRefresh} from './../components/general';

const compareCourseByStartDate = comparingMod('start', moment);

class Courses extends Component {

  toElement = (month, courseElements, defaultExpanded) => (
    <Grid item xs={12} sm={10} md={8} key={month}>
      <ExpansionPanel defaultExpanded={defaultExpanded}>
        <ExpansionPanelSummary expandIcon={<IconExpandMore/>}>
          <Typography variant='subheading'>{month}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{padding: '0px'}}>
          <List style={{width: '100%'}}>
            {courseElements}
          </List>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Grid>
  );

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
        const defaultExpanded = elements.length === 0;
        elements.push(this.toElement(lastMonth, courseElements, defaultExpanded));
        courseElements = [];
      }
      lastMonth = formattedMonth;

      if (lastFormatted !== formattedDayOfCourse) {
        courseElements.push(
          <Subheader key={formattedDayOfCourse} label={formattedDayOfCourse}/>
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
    elements.push(this.toElement(lastMonth, courseElements));

    return (<Grid container spacing={16} justify='center' style={{width: '100%', margin: '0px'}}>
      {elements}
    </Grid>);
  };


  render() {
    return (
      <div className={this.props.classes.root}>
        <PullToRefresh
          pending={this.props.courses.pending}
          onRefresh={this.props.actions.fetchCourses}>
          {this.getCourses()}
        </PullToRefresh>
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
    fetchCourses: fetchCourses,
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