'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import moment from 'moment';
import List, {ListItem, ListItemText, ListItemIcon} from 'material-ui/List';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import {
  DialogContent,
  DialogActions,
} from 'material-ui/Dialog';
import {InputAdornment} from 'material-ui/Input';
import Collapse from 'material-ui/transitions/Collapse';
import Avatar from 'material-ui/Avatar';
import {TypeMapper} from '.';
import * as Format from '../../utils/Format';
import {ProfilePicture} from './../profile';
import {showNotification} from './../../model/notification';
import {Dialog, ListItemInput, ListItemSelect} from './../general';
import {MODE, NEW_COURSE} from './../../model/courses';
import {TITLE_BG} from '../../utils/Style';

import {
  IconCalendar,
  IconClock,
  IconLocation,
  IconPencil,
  IconUser,
  IconUserGroup
} from '../../utils/Icons';

import {MdExpandMore, MdExpandLess} from 'react-icons/lib/md';
import {findById} from "../../utils/RamdaUtils";
import {LoadingIndicator} from "../general";
import {
  fetchCourses,
  hideCourseDetails,
  onCourseDetailsChange,
  saveCourseDetails,
  signIn,
  signOut,
  toggleAttendeeList,
  toggleEditCourse
} from "../../model/courses";

const getAttendeeList = attendees =>
  attendees.map((user, idx) =>
      <ListItem key={idx}>
        <ListItemIcon>
          <Avatar style={{backgroundColor: TITLE_BG}}>
            <ProfilePicture userId={user.id} />
          </Avatar>
        </ListItemIcon>
        <ListItemText inset primary={user.firstname + " " + user.lastname}/>
      </ListItem>
  );

class CourseDetails extends Component {

  handleRequestClose = () => {
    // TODO unsaved 000_user?
    this.props.actions.hideCourseDetails();
  };

  handleRequestSave = () => {
    // TODO onRequestSave
    this.props.actions.saveCourseDetails(this.props.course);
  };

  signInOut = () => {
    const {id, signedIn} = this.props.course;
    if (signedIn) {
      this.props.actions.signOut(id);
      this.handleRequestClose();
    } else {
      this.props.actions.signIn(id);
      this.handleRequestClose();
    }
  };

  render() {
    const {
      courseDetails = {},
      pending,
      currentUser,
      courseTypes,
      actions} = this.props;
    const {
      show,
      mode = MODE.CREATE,
      showAttendees,
      course = NEW_COURSE
    } = courseDetails;
    const {
      toggleAttendeeList,
      toggleEditCourse,
      onCourseDetailsChange
    } = actions;

    const {title, readonly} = mode;
    const {start, courseTypeId, minutes, attendees = [],
      instructor = {}, maxParticipants, signedIn} = course;
    const attendeesList = getAttendeeList(attendees);

    if (pending) {
      return <LoadingIndicator/>;
    }

    const {name = " ", color} = findById(courseTypes.data, courseTypeId) || TypeMapper['SOFT'];
    const short = name.charAt(0);
    const {roles = {}} = currentUser;
    return (
      <Dialog
        title={title}
        onClose={this.handleRequestClose}
        secondAction={
          (mode === MODE.VIEW && (roles.ADMIN || roles.TRAINER))
            ? <IconButton color='contrast' onClick={toggleEditCourse}>
                <IconPencil/>
              </IconButton>
            : undefined
        }
        open={show}>
        <DialogContent style={{padding: '0', paddingTop: '12px'}}>
          <List>
            <ListItemSelect
              id="type"
              readonly={readonly}
              label="Kurstyp"
              value={courseTypeId}
              values={courseTypes.data}
              keyProp='id'
              valueProp='name'
              onChange={value => onCourseDetailsChange('courseTypeId', value)}
              iconBackground={color}
              icon={short}/>
            <ListItemInput id="start_date" label="Kursdatum" type="date" value={moment(start).format(Format.ISO_DATE_FORMAT)}
                 readonly={readonly}
                 onChange={value => {
                   const date = moment(value, Format.ISO_DATE_FORMAT);
                   if (!date.isValid()) {
                     return;
                   }
                   const newStart = moment(start).set({'year': date.year(), 'month': date.month(), 'date': date.date()});
                   if (newStart.isValid()) {
                     onCourseDetailsChange('start', newStart.format(Format.TIMESTAMP_FORMAT));
                   }
                 }}
                 icon={<IconCalendar/>}/>
            <ListItemInput id="start_time" label="Kursbeginn" type="time" value={moment(start).format(Format.HOUR_MINUTE)}
                 readonly={readonly}
                 onChange={value => {
                   const time = moment(value, "HH:mm");
                   const newStart = moment(start).set({'hour': time.hour(), 'minute': time.minute()});
                   onCourseDetailsChange('start', newStart.format(Format.TIMESTAMP_FORMAT));
                 }}
                 icon={<IconClock/>}/>
            <ListItemInput id="duration" label="Dauer" type="number" value={minutes}
                 endAdornment={<InputAdornment position="end">Minuten</InputAdornment>}
                 readonly={readonly} onChange={value => onCourseDetailsChange('minutes', Number.parseInt(value))}
                 icon={<IconClock/>}/>
            <ListItemInput id="instructor" label="Kursleitung" value={instructor.firstname + " " + instructor.lastname}
                 readonly={true} onChange={value => onCourseDetailsChange('instructor', value)}
                 icon={<ProfilePicture userId={instructor.id} />}/>
            <ListItemInput id="location" label="Ort" value={'Toppenstedt'}
                 readonly={true} onChange={() => {}}
                 icon={<IconLocation/>}/>
            <ListItemInput id="maxParticipants" label="Max. Kursteilnehmer" type="number" value={maxParticipants}
                 readonly={readonly}
                 onChange={value => onCourseDetailsChange('maxParticipants', Number.parseInt(value))}
                 icon={<IconUser/>}/>

            {mode !== MODE.CREATE
              ? (<ListItem button onClick={toggleAttendeeList}>
                <ListItemIcon>
                  <Avatar style={{backgroundColor: TITLE_BG}}>
                    <IconUserGroup/>
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={"Teilnemer (" + attendees.length + ")"}/>
                {showAttendees ? <MdExpandLess/> : <MdExpandMore/>}
              </ListItem>)
              : undefined
            }
            {mode !== MODE.CREATE
              ? (<Collapse component="li" in={showAttendees} timeout='auto' unmountOnExit>
                  <List component='div' disablePadding>
                    {attendeesList}
                  </List>
                </Collapse>)
              : undefined
            }
          </List>
        </DialogContent>

        <DialogActions>
          {
            mode === MODE.VIEW
            ? <Button key='course-details-button-1-a' color='primary' onClick={this.signInOut}>
                {signedIn ? 'Abmelden' : 'Teilnehmen'}
              </Button>
            : <Button key='course-details-button-1-b' onClick={this.handleRequestSave}>
                {'Speichern'}
              </Button>
          }
          {
            mode === MODE.VIEW
              ? <Button key='course-details-button-2-a' color='primary' onClick={this.handleRequestClose}>
                {'Schließen'}
              </Button>
              : <Button key='course-details-button-2-b' onClick={mode === MODE.MODIFY ? toggleEditCourse : this.handleRequestClose}>
                {'Abbrechen'}
              </Button>
          }
        </DialogActions>
      </Dialog>
    );
  };
}

const mapStateToProps = state => ({
  currentUser: state.profile.user,
  courseTypes: state.courseTypes,
  courseDetails: state.courses.courseDetails
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    showNotification: showNotification,
    // courses
    fetchCourses: fetchCourses,
    hideCourseDetails: hideCourseDetails,
    saveCourseDetails: saveCourseDetails,
    toggleAttendeeList: toggleAttendeeList,
    toggleEditCourse: toggleEditCourse,
    onCourseDetailsChange: onCourseDetailsChange,
    signIn: signIn,
    signOut: signOut,
  }, dispatch),
  dispatch
});


export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(CourseDetails);