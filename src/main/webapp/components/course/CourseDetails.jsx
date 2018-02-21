'use strict';
import React, {Component} from 'react';
import moment from 'moment';
import List, {ListItem, ListItemText, ListItemIcon} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import {
  DialogContent,
  DialogActions,
} from 'material-ui/Dialog';
import {InputAdornment} from 'material-ui/Input';
import Collapse from 'material-ui/transitions/Collapse';
import Avatar from 'material-ui/Avatar';
import {TypeMapper} from '.';
import * as Format from '../../utils/Format.jsx';
import {ProfilePicture} from './../profile';
import {Dialog, Row, FadeButton} from './../general';
import {MODE, NEW_COURSE} from './../../model/courses';

import {FaCalendarO, FaClockO, FaMapMarker, FaUser, FaUserMd, FaClose, FaPencil, FaEye} from 'react-icons/lib/fa';
import {MdExpandMore, MdExpandLess} from 'react-icons/lib/md';

const getAttendeeList = attendees => {
  const attendeesList = [];
  for (const idx in attendees) {
    const user = attendees[idx];
    attendeesList.push(
      <ListItem key={idx}>
        <Avatar>
          <ProfilePicture userId={user.id} />
        </Avatar>
        <ListItemText inset primary={user.firstname + " " + user.lastname}/>
      </ListItem>
    );
  }
  return attendeesList;
};

class CourseDetails extends Component {

  handleRequestClose = () => {
    // TODO unsaved 000_user?
    this.props.onClose();
  };

  handleRequestSave = () => {
    // TODO onRequestSave
    this.props.onSave(this.props.course);
    this.props.onClose();
  };

  signInOut = () => {
    const {id, signedIn} = this.props.course;
    if (signedIn) {
      this.props.signOut(id);
      this.handleRequestClose();
    } else {
      this.props.signIn(id);
      this.handleRequestClose();
    }
  };

  render() {
    const {mode = MODE.CREATE,
      show,
      showAttendees,
      course = NEW_COURSE,
      toggleAttendeeList,
      toggleEditCourse,
      onCourseDetailsChange} = this.props;

    const {title, readonly} = mode;

    const {start, type = 'SOFT', minutes, attendees = [],
      instructor = {}, maxParticipants, signedIn} = course;

    const attendeesList = getAttendeeList(attendees);

    const {label, icon, color} = TypeMapper[type];

    return (
      <Dialog
        title={title}
        onClose={this.props.onClose}
        secondAction={
          mode === MODE.VIEW // TODO && admin/moderator/trainer
            ? <IconButton color='contrast' onClick={toggleEditCourse}>
                <FaPencil/>
              </IconButton>
            : undefined
        }
        open={show}>
        <DialogContent>
          <List>
            <Row id="type" label="Kurstyp" value={label}
                 readonly={true}
                 onChange={value => {/*TODO*/}}
                 icon={icon({color: color})}/>
            <Row id="start_date" label="Kursdatum" type="date" value={moment(start).format(Format.ISO_DATE_FORMAT)}
                 readonly={readonly}
                 onChange={value => {

                   console.warn("CHANGE DATE", value);
                   const date = moment(value, Format.ISO_DATE_FORMAT);
                   console.warn("d-- ", date);
                   console.warn("d-v ", date.isValid());
                   if (!date.isValid()) {
                     return;
                   }
                   console.warn("s-- ", start);
                   console.warn("m-- ", moment(start));
                   const newStart = moment(start).set({'year': date.year(), 'month': date.month(), 'date': date.date()});
                   console.warn("--- ", newStart);
                   console.warn("v-- ", newStart.isValid());
                   if (newStart.isValid()) {
                     console.warn("f-- ", newStart.format(Format.TIMESTAMP_FORMAT));

                     onCourseDetailsChange('start', newStart.format(Format.TIMESTAMP_FORMAT));
                   }
                 }}
                 icon={<FaCalendarO/>}/>
            <Row id="start_time" label="Kursbeginn" type="time" value={moment(start).format(Format.HOUR_MINUTE)}
                 readonly={readonly}
                 onChange={value => {
                   const time = moment(value, "HH:mm");
                   const newStart = moment(start).set({'hour': time.hour(), 'minute': time.minute()});
                   onCourseDetailsChange('start', newStart.format(Format.TIMESTAMP_FORMAT));
                 }}
                 icon={<FaClockO/>}/>
            <Row id="duration" label="Dauer" type="number" value={minutes}
                 endAdornment={<InputAdornment position="end">Minuten</InputAdornment>}
                 readonly={readonly} onChange={value => onCourseDetailsChange('minutes', Number.parseInt(value))}
                 icon={<FaClockO/>}/>
            <Row id="instructor" label="Kursleitung" value={instructor.firstname + " " + instructor.lastname}
                 readonly={true} onChange={value => onCourseDetailsChange('instructor', value)}
                 icon={
                   <Avatar>
                     <ProfilePicture userId={instructor.id} />
                   </Avatar>
                 }/>
            <ListItem>
              <ListItemIcon>
                <FaMapMarker/>
              </ListItemIcon>
              <ListItemText
                inset
                primary={"Kuhstall"}
                secondary={"irgendwo in Toppenstedt"}/>
            </ListItem>
            <Row id="maxParticipanrs" label="Max. Kursteilnehmer" type="number" value={maxParticipants}
                 readonly={readonly}
                 onChange={value => onCourseDetailsChange('maxParticipants', Number.parseInt(value))} icon={<FaUser/>}/>

            {mode !== MODE.CREATE
              ? (<ListItem button onClick={toggleAttendeeList}>
                <ListItemIcon>
                  <FaUser/>
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={"Teilnemer (" + attendees.length + ")"}/>
                {showAttendees ? <MdExpandLess/> : <MdExpandMore/>}
              </ListItem>)
              : undefined
            }
            {mode !== MODE.CREATE
              ? (<Collapse component="li" in={showAttendees} timeout="auto" unmountOnExit>
                  <List disablePadding>
                    {attendeesList}
                  </List>
                </Collapse>)
              : undefined
            }
          </List>
        </DialogContent>
        <DialogActions>
          <div style={{position: 'relative'}}>
            <FadeButton
              inProp={mode === MODE.VIEW}
              onClick={this.signInOut}>
              {signedIn ? 'Abmelden' : 'Teilnehmen'}
            </FadeButton>
            <FadeButton
              inProp={mode !== MODE.VIEW}
              onClick={this.handleRequestSave}
              style={{position: 'absolute', left: '0px', top: '0px'}}>
              Speichern
            </FadeButton>
          </div>

          <div style={{position: 'relative'}}>
            <FadeButton
              inProp={mode === MODE.VIEW}
              onClick={this.handleRequestClose}>
              Schließen
            </FadeButton>
            <FadeButton
              inProp={mode !== MODE.VIEW}
              onClick={mode === MODE.MODIFY ? toggleEditCourse : this.handleRequestClose}
              style={{position: 'absolute', left: '0px', top: '0px'}}>
              Abbrechen
            </FadeButton>
          </div>
        </DialogActions>
      </Dialog>
    );
  };
}

export default CourseDetails;