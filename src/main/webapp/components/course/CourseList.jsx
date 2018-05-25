'use strict';
import React from 'react';
import moment from 'moment';
import {Subheader} from './../general';
import List from '@material-ui/core/List';
import {comparingMod} from '../../utils/Comparator';
import * as Format from '../../utils/Format';
import Course from '.';

const compareCourseByStartDate = comparingMod('start', moment);

const CourseList = ({courses, showCourseDetails}) => {
  const elements = [];
  courses.sort(compareCourseByStartDate);
  let lastFormatted = undefined;
  for (const idx in courses) {
    const course = courses[idx];
    const formattedDayOfCourse = moment(course.start).format(Format.DAY_OF_WEEK_DATE_FORMAT);
    if (lastFormatted !== formattedDayOfCourse) {
      lastFormatted = formattedDayOfCourse;
      elements.push(
        <Subheader key={formattedDayOfCourse} label={formattedDayOfCourse} />
      );
    }
    elements.push(<Course key={idx} course={course} showCourseDetails={showCourseDetails}/>);
  }

  return (<List style={{padding: '0'}}>{elements}</List>);
};

export default CourseList;