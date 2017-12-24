'use strict';
import React from 'react';
import moment from 'moment';
import List, {ListSubheader} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Course from '.';

import {blueGrey} from 'material-ui/colors';

const compareCourseByStartDate = (c1, c2) => {
  const c1Start = moment(c1.start);
  const c2Start = moment(c2.start);
  if (c1Start > c2Start) return 1;
  else if (c1Start < c2Start) return -1;
  else return 0;
};

const CourseList = ({courses, showCourseDetails}) => {
  const elements = [];
  courses.sort(compareCourseByStartDate);
  let lastFormatted = undefined;
  for (const idx in courses) {
    const course = courses[idx];
    const formattedDayOfCourse = moment(course.start).format("dddd, DD.MM.YYYY");
    if (lastFormatted !== formattedDayOfCourse) {
      lastFormatted = formattedDayOfCourse;
      elements.push(
        <ListSubheader key={formattedDayOfCourse} style={{background: blueGrey.A400, color: 'white', lineHeight: '32px'}}>
          {formattedDayOfCourse}
        </ListSubheader>
      );
    } else {
      elements.push(<Divider key={idx + "_divider"} inset light/>);
    }
    elements.push(<Course key={idx} course={course} showCourseDetails={showCourseDetails}/>);
  }

  return (<List>{elements}</List>);
};

export default CourseList;