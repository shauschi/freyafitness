import React, {Component} from 'react';
import compose from 'recompose/compose';
import {connect} from 'react-redux';
import moment from 'moment';
import * as Format from '../../utils/Format';
import Typography from 'material-ui/Typography';
import {ListItem} from 'material-ui/List';
import {findById} from './../../utils/RamdaUtils';

import {green, blue, red} from 'material-ui/colors';

export const TypeMapper = {
  SOFT: {label: 'sanfter Kurs', short: 'S', color: green['A200']},
  NORMAL: {label: 'normaler Kurs', short: 'N', color: blue['A200']},
  HARD: {label: 'harter Kurs', short: 'H', color: red['A200']}
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

class Course extends Component {

  render() {
    const {course, courseTypes, showCourseDetails, showDate} = this.props;
    const {
      id,
      courseTypeId,
      start,
      minutes,
      instructor,
      signedIn,
      attendees = [],
      maxParticipants,
      canceled
    } = course;

    const {name, color} = findById(courseTypes.data, courseTypeId) || TypeMapper['SOFT'];
    const textDecoration = canceled ? 'line-through' : undefined;

    const title = (<div>
      <Typography type={'title'} style={{textDecoration: textDecoration}}>{name}</Typography>
    </div>);
    const details = (<div>
      <Typography
        style={{display: 'inline-block', textDecoration: textDecoration}}>{'mit ' + instructor.firstname}</Typography>
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
      backgroundColor = 'rgba(255, 255, 255, 0.75)';
    }

    return (
      <ListItem
        button
        onClick={() => showCourseDetails(id)}
        style={{backgroundColor: backgroundColor, position: 'relative'}}>
        <div style={{
          position: 'relative',
          height: '100%',
          width: '36px',
          display: 'inline-block',
          padding: '0 40px 0 0'
        }}> {/* 16px + 8px + 16px */}
          {showDate
            ? <Typography>
              {moment(start).format('DD.MM.')}
            </Typography>
            : undefined
          }
          <Typography>
            {moment(start).format(Format.HOUR_MINUTE)}
          </Typography>
          <Typography style={{color: 'grey'}}>
            {moment(start).add(minutes, 'minutes').format(Format.HOUR_MINUTE)}
          </Typography>
        </div>
        <div style={{display: 'inline-block', width: '100%'}}>
          {title}
          {details}
          {additional}
          {infos}
        </div>
        <div
          id={'color_bar_course_' + id}
          style={{
            backgroundColor: color,
            position: 'absolute',
            left: '68px', /* 16px + 36px + 16px */
            width: '8px',
            height: '100%',
            minHeight: '100%'
          }}
        />
      </ListItem>
    );
  };
}

const mapStateToProps = state => ({
  courseTypes: state.courseTypes,
});

export default compose(
  connect(mapStateToProps)
)(Course);