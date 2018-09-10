import React, {Component} from 'react';
import compose from 'recompose/compose';
import {connect} from 'react-redux';
import moment from 'moment';
import * as Format from '../../utils/Format';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import {findById} from './../../utils/RamdaUtils';
import {IconMoreVert} from './../../utils/Icons';
import {withRouter} from 'react-router-dom';

import {red} from '@material-ui/core/colors';
import {setPath, viewPath} from "../../utils/RamdaUtils";

export const TypeMapper = {
  UNKNOWN: {name: 'unbekannter Kurs', color: red['A200']}
};

const getAvailability = (participants, maxParticipants, textDecoration) => {
  const free = maxParticipants - participants.length;
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

  elements = {};

  state = {
    course: {
      anchor: null,
      course: null
    }
  };

  openMenu = (event, course) => {
    this.setState(setPath(['course'], {anchor: event.currentTarget, course: course}, this.state));
  };

  closeMenu = () => {
    this.setState(setPath(['course'], {anchor: null, course: null}, this.state));
  };

  styleFromElement = e => {
    const {top, right, bottom, left, width, height} = e.getBoundingClientRect();
    return {top, right, bottom, left, width, height};
  };

  showCourseDetails = () => {
    const {course, history, location} = this.props;
    const from = this.styleFromElement(this.elements.item);
    const title = this.styleFromElement(this.elements.title);

    from.backgroundColor = 'rgba(255,255,255,0.0)';

    history.push({
      pathname: location.pathname + '/course/' + course.id,
      state: {
        to: 'modal',
        data: course,
        from: from,
        title: {top: title.top-from.top, left: title.left-from.left},
      }
    });
  };

  getCourseMenu = () => {
    const {anchor, course} = this.state.course;
    const {signIn, signOut} = this.props;
    const courseId = viewPath(['course', 'id'], this.props);
    const signedIn = viewPath(['course', 'signedIn'], this.props);
    return <Menu
      open={!!anchor}
      anchorEl={anchor}
      onClose={this.closeMenu}>
      {
        signedIn
          ? <MenuItem onClick={() => {
            this.closeMenu();
            signOut(courseId);
          }}>
            <span style={{marginLeft: '8px'}}>Abmelden</span>
          </MenuItem>
          : <MenuItem onClick={() => {
            this.closeMenu();
            signIn(courseId);
          }}>
            <span style={{marginLeft: '8px'}}>Teilnehmen</span>
          </MenuItem>
      }
      <MenuItem onClick={() => {
        this.closeMenu();
        this.showCourseDetails();
      }}>
        <span style={{marginLeft: '8px'}}>Details anzeigen</span>
      </MenuItem>
    </Menu>
  };

  render() {
    const {course, courseTypes, showDate} = this.props;
    const {
      id,
      courseTypeId,
      start,
      minutes,
      instructor,
      signedIn,
      attendees,
      maxParticipants,
      canceled
    } = course;

    const {name, color} = findById(courseTypes.data, courseTypeId) || TypeMapper.UNKNOWN;
    const textDecoration = canceled ? 'line-through' : undefined;

    const title = (<div>
      <span ref={e => this.elements.title = e}>
        <Typography type={'title'} style={{display: 'inline-block', textDecoration: textDecoration}}>
          {name}
        </Typography>
      </span>
      <Typography
        style={{
          display: 'inline-block',
          float: 'right',
          textDecoration: textDecoration
        }}>{'mit ' + instructor.firstname}</Typography>
    </div>);
    const additional = (<div>
      {signedIn ?
        <Typography style={{display: 'inline-block', color: 'green'}}>Du bist angemeldet</Typography> : undefined}
      {getAvailability(attendees, maxParticipants, textDecoration)}
    </div>);
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
        onClick={this.showCourseDetails}
        ContainerProps={{ref: e => this.elements.item = e}}
        style={{backgroundColor: backgroundColor, position: 'relative'}}>
        <div style={{
          position: 'relative',
          height: '100%',
          width: '36px',
          display: 'inline-block',
          padding: '0 36px 0 0'
        }}> {/* 16px + 4px + 16px */}
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
        <div style={{display: 'inline-block', width: '100%', paddingRight: '24px'}}>
          {title}
          {additional}
          {infos}
        </div>
        <div
          id={'color_bar_course_' + id}
          style={{
            backgroundColor: color,
            position: 'absolute',
            left: '68px', /* 16px + 36px + 16px */
            width: '4px',
            height: '100%',
            minHeight: '100%'
          }}
        />
        <ListItemSecondaryAction>
          <IconButton aria-label='more' onClick={event => this.openMenu(event, course)}>
            <IconMoreVert/>
          </IconButton>
          {this.getCourseMenu()}
        </ListItemSecondaryAction>
      </ListItem>
    );
  };
}

const mapStateToProps = state => ({
  courseTypes: state.courseTypes,
});

export default compose(
  withRouter,
  connect(mapStateToProps)
)(Course);