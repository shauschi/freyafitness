import React from 'react';
import moment from 'moment';
import * as Format from '../../utils/Format.jsx';
import Typography from 'material-ui/Typography';
import {ListItem, ListItemIcon} from 'material-ui/List';
import {FaCloud, FaRocket, FaBolt} from 'react-icons/lib/fa';

import {lightBlue, blue, red} from 'material-ui/colors';

export const TypeMapper = {
  SOFT: {label: 'sanfter Kurs', icon: FaCloud, color: lightBlue['A200']},
  NORMAL: {label: 'normaler Kurs', icon: FaRocket, color: blue['A200']},
  HARD: {label: 'harter Kurs', icon: FaBolt, color: red['A200']}
};

const getAvailability = (participants, maxParticipants) => {
  if (maxParticipants === participants) {
    return <Typography style={{color: 'red', display: 'inline-block', float: 'right'}}>Ausgebucht</Typography> /*TODO Warteliste*/
  } else {
    const color = maxParticipants - participants > 2 ? 'grey' : 'orange';
    return <Typography style={{color: color, display: 'inline-block', float: 'right'}}>{maxParticipants - participants} freie Plätze</Typography>
  }
};

const Course = ({course, showCourseDetails}) => {
  const {id, type, start, minutes, instructor, signedIn, attendees = [], maxParticipants} = course;
  const {label, icon, color} = TypeMapper[type];

  const title = (<div>
    <Typography type='title'>{label}</Typography>
  </div>);
  const details = (<div>
    <Typography style={{display: 'inline-block'}}>{moment(start).format(Format.HOUR_MINUTE) + " mit " + instructor.firstname + " (" + minutes + " min)"}</Typography>
    {getAvailability(attendees.length, maxParticipants)}
  </div>);
  const additional = signedIn ? (<div>
    <Typography style={{color: 'green'}}>Du nimmst teil</Typography>
  </div>) : undefined;

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