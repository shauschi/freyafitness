import React from 'react';
import moment from 'moment';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
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

  const title = (<div>
    <Typography type='title'>{label}</Typography>
  </div>);
  const details = (<div>
    <Typography style={{display: 'inline-block'}}>{moment(start).format("HH:mm") + " mit " + instructor + " (" + minutes + " min)"}</Typography>
    <Typography style={{color: 'orange', display: 'inline-block', float: 'right'}}>2 freie Plätze</Typography>
  </div>);
  const additional = (<div>
    <Typography style={{color: 'green'}}>Du nimmst teil</Typography>
  </div>);

  return (
    <ListItem button onClick={() => showCourseDetails(id)}>
      <ListItemIcon>
        {icon({color: color})}
      </ListItemIcon>
      <div style={{width: '100%'}}>
        {title}
        {details}
        {additional}
      </div>
    </ListItem>
  );
};

export default Course;