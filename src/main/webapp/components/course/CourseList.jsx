'use strict';
import React from 'react';
import moment from 'moment';
import List, {ListSubheader} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import {comparingMod} from '../../utils/Comparator.jsx';
import * as Format from '../../utils/Format.jsx';
import Course from '.';

import {blueGrey} from 'material-ui/colors';

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