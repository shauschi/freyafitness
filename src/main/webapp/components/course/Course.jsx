import React from 'react';
import moment from 'moment';
import IconButton from 'material-ui/IconButton';
import {ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction} from 'material-ui/List';
import {FaCloud, FaRocket, FaBolt, FaInfo} from 'react-icons/lib/fa';

import {lightBlue, blue, red} from 'material-ui/colors';

export const TypeMapper = {
  SOFT: {label: 'sanfter Kurs', icon: FaCloud, color: lightBlue['A200']},
  NORMAL: {label: 'normaler Kurs', icon: FaRocket, color: blue['A200']},
  HARD: {label: 'harter Kurs', icon: FaBolt, color: red['A200']}
};

const Course = ({course, showCourseDetails}) => {
  const {id, type, start, minutes, instructor} = course;
  const {label, icon, color} = TypeMapper[type];

  return (
    <ListItem button onClick={() => showCourseDetails(id)}>
      <ListItemIcon>
        {icon({color: color})}
      </ListItemIcon>
      <ListItemText
        inset
        primary={label}
        secondary={moment(start).format("dd, HH:mm") + " mit " + instructor + " (" + minutes + " min)"}/>
      <ListItemSecondaryAction >
        <IconButton aria-label="Comments">
          <FaInfo />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default Course;