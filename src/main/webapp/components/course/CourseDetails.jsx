'use strict';
import React, {Component} from 'react';
import moment from 'moment';
import Typography from 'material-ui/Typography';
import List, {ListItem, ListItemText, ListItemIcon} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import Dialog, {
  DialogContent,
  DialogActions,
  DialogTitle,
  withMobileDialog
} from 'material-ui/Dialog';
import {FormControl} from 'material-ui/Form';
import Input, {InputLabel, InputAdornment} from 'material-ui/Input';
import Collapse from 'material-ui/transitions/Collapse';
import Avatar from 'material-ui/Avatar';
import Slide from 'material-ui/transitions/Slide';
import {TypeMapper} from '.';
import * as Format from '../../utils/Format.jsx';

import {FaCalendarO, FaClockO, FaMapMarker, FaUser, FaUserMd, FaClose, FaPencil, FaEye} from 'react-icons/lib/fa';
import {MdExpandMore, MdExpandLess} from 'react-icons/lib/md';
import {blueGrey} from 'material-ui/colors';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const Row = ({icon, id, label, type, value, endAdornment, onChange, readonly}) => {
  return (
    <ListItem>
      <ListItemIcon>
        {icon}
      </ListItemIcon>
      <FormControl>
        <InputLabel htmlFor={id}>{label}</InputLabel>
        <Input id={id} type={type}
               endAdornment={endAdornment}
               value={value}
               onChange={event => onChange(event.target.value)}
               disabled={readonly}/>
      </FormControl>
    </ListItem>
  );
};

const getAttendeeList = attendees => {
  const attendeesList = [];
  for (const idx in attendees) {
    const user = attendees[idx];
    attendeesList.push(
      <ListItem key={idx}>
        <Avatar>
          <FaUser/>
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
    this.props.onSave(this.props.courseDetails.details);
    this.props.onClose();
  };

  signInOut = () => {
    const id = this.props.courseDetails.details.id;
    if (this.props.courseDetails.details.signedIn) {
      this.props.signOut(id);
      this.handleRequestClose();
    } else {
      this.props.signIn(id);
      this.handleRequestClose();
    }
  };

  render() {
    const {courses, courseDetails, fullScreen, toggleAttendeeList, toggleEditCourse, onCourseDetailsChange} = this.props;
    const details = courseDetails.details || {};
    const {id} = details;
    const readonly = !courseDetails.edit;
    let course = {};
    for (const c of courses) {
      if (c.id === id) {
        course = c;
        break;
      }
    }
    const {start, type, minutes, attendees = [], instructor, maxParticipants, signedIn} = details;

    let title = 'pending...';
    if (!courseDetails.show || courseDetails.pending) {
      return null;
    }

    if (!courseDetails.pending && courseDetails.show) {
      const {label, icon, color} = TypeMapper[courseDetails.details.type];
      title = (<span><span>{icon({color: color, style: {marginRight: '12px'}})}</span><span>{label}</span></span>);
    }
    const attendeesList = getAttendeeList(attendees);

    const {label, icon, color} = TypeMapper[type];

    return (
      <Dialog
        onClose={this.handleRequestClose}
        fullScreen={fullScreen}
        transition={Transition}
        open={courseDetails.show}>
        <DialogTitle disableTypography
                     style={{color: 'white', background: blueGrey.A700, display: 'flex', padding: '2px 16px'}}>
          <IconButton style={{color: 'white'}} onClick={this.handleRequestClose} aria-label="Close">
            <FaClose/>
          </IconButton>
          <Typography type="title" style={{color: 'white', flex: 1, textAlign: 'center', padding: '14px 0'}}>
            {readonly ? 'Kurs betrachten' : 'Kurs bearbeiten'}
          </Typography>
          <IconButton style={{color: 'white'}} onClick={toggleEditCourse}>
            {readonly ? <FaPencil/> : <FaEye/>}
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <List>
            <Row id="type" label="Kurstyp" value={label}
                 readonly={true}
                 onChange={value => {/*TODO*/}}
                 icon={icon({color: color})}/>
            <Row id="start_date" label="Kursdatum" type="date" value={moment(start).format(Format.ISO_DATE_FORMAT)}
                 readonly={readonly}
                 onChange={value => {
                   const date = moment(value, Format.ISO_DATE_FORMAT);
                   const newStart = moment(start).set({'year': date.year(), 'month': date.month(), 'day': date.day()});
                   onCourseDetailsChange('start', newStart.format(Format.TIMESTAMP_FORMAT));
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
                 readonly={true} onChange={value => onCourseDetailsChange('instructor')} icon={<FaUserMd/>}/>
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
            <ListItem button onClick={toggleAttendeeList}>
              <ListItemIcon>
                <FaUser/>
              </ListItemIcon>
              <ListItemText
                inset
                primary={"Teilnemer (" + attendees.length + ")"}/>
              {courseDetails.showAttendees ? <MdExpandLess/> : <MdExpandMore/>}
            </ListItem>

            <Collapse component="li" in={courseDetails.showAttendees} timeout="auto" unmountOnExit>
              <List disablePadding>
                {attendeesList}
              </List>
            </Collapse>
          </List>
        </DialogContent>
        <DialogActions>
          {readonly ?
            (<Button onClick={this.handleRequestClose} color="primary">Schließen</Button>) :
            (<Button onClick={this.handleRequestSave} color="primary">Speichern</Button>)}
          <Button onClick={this.signInOut} color="primary">
            {signedIn ? "Abmelden" : "Teilnehmen"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
}

export default withMobileDialog()(CourseDetails);