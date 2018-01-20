import React from 'react';
import moment from 'moment';
import Typography from 'material-ui/Typography';
import {ListItem, ListItemIcon} from 'material-ui/List';
import {FaCloud, FaRocket, FaBolt} from 'react-icons/lib/fa';

import {lightBlue, blue, red} from 'material-ui/colors';

export const TypeMapper = {
  SOFT: {label: 'sanfter Kurs', icon: FaCloud, color: lightBlue['A200']},
  NORMAL: {label: 'normaler Kurs', icon: FaRocket, color: blue['A200']},
  HARD: {label: 'harter Kurs', icon: FaBolt, color: red['A200']}
};

const getAvailability = (participants, maxParticipants, textDecoration) => {
  const free = maxParticipants - participants;
  let color = free > 2 ? 'grey' : 'orange';
  let text = (free) + (free === 1 ? ' freier Platz' : ' freie Plätze');
  if (free <= 0) {
    color = 'red';
    text = 'Warteliste';
  }
  return (
    <Typography style={{color: color, display: 'inline-block', float: 'right', textDecoration: textDecoration}}>
      {text}
    </Typography>
  );
};

const Course = ({course, showCourseDetails}) => {
  const {id, type, start, minutes, instructor, signedIn, attendees = [], maxParticipants, canceled} = course;
  const {label, icon, color} = TypeMapper[type];
  const textDecoration = canceled ? 'line-through' : undefined;

  const title = (<div>
    <Typography type='title' style={{textDecoration: textDecoration}}>{label}</Typography>
  </div>);
  const details = (<div>
    <Typography style={{display: 'inline-block', textDecoration: textDecoration}}>{moment(start).format("HH:mm") + " mit " + instructor.firstname + " (" + minutes + " min)"}</Typography>
    {getAvailability(attendees.length, maxParticipants, textDecoration)}
  </div>);
  const additional = signedIn ? (<div>
    <Typography style={{color: 'green'}}>Du bist angemeldet</Typography>
  </div>) : undefined;
  const infos = canceled ? (<div>
    <Typography style={{color: 'red'}}>Der Kurs wurde abgesagt</Typography>
  </div>) : undefined;

  let backgroundColor;
  if (!canceled) {
    backgroundColor = signedIn ? 'rgba(200, 255, 200, 0.75)' : 'rgba(255, 255, 255, 0.75)';
  }

  return (
    <ListItem button onClick={() => showCourseDetails(id)} style={{backgroundColor: backgroundColor}}>
      <ListItemIcon>
        {icon({color: color})}
      </ListItemIcon>
      <div style={{width: '100%'}}>
        {title}
        {details}
        {additional}
        {infos}
      </div>
    </ListItem>
  );
};

export default Course;