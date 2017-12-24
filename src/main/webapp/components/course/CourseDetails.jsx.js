'use strict';
import React, {Component} from 'react';
import moment from 'moment';
import List, {ListItem, ListItemText, ListItemIcon} from 'material-ui/List';
import Button from 'material-ui/Button';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogActions,
  withMobileDialog
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Collapse from 'material-ui/transitions/Collapse';
import Avatar from 'material-ui/Avatar';
import Slide from 'material-ui/transitions/Slide';
import {TypeMapper} from ".";

import {FaCalendarO, FaClockO, FaMapMarker, FaUser, FaUserMd} from 'react-icons/lib/fa';
import {MdExpandMore, MdExpandLess} from 'react-icons/lib/md';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class CourseDetails extends Component {
  handleRequestClose = () => {
    this.props.onRequestClose();
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
    const {courses, courseDetails, fullScreen, toggleAttendeeList} = this.props;
    const details = courseDetails.details || {};
    const {id} = details;
    let course = {};
    for (const c of courses) {
      if (c.id === id){
        course = c;
        break;
      }
    }
    const {start, minutes, attendees = [], instructor, maxParticipants, signedIn} = course;

    let title = 'pending...';
    if (!courseDetails.show || courseDetails.pending) {
      return null;
    }

    if (!courseDetails.pending && courseDetails.show) {
      const {label, icon, color} = TypeMapper[courseDetails.details.type];
      title = (<span><span>{icon({color: color, style: {marginRight: '12px'}})}</span><span>{label}</span></span>);
    }

    const attendeesList = [];
    for (const idx in attendees) {
      const user = attendees[idx];
      attendeesList.push(
        <ListItem key={idx}>
          <Avatar>
            <FaUser />
          </Avatar>
          <ListItemText inset primary={user.firstname + " " + user.lastname} />
        </ListItem>
      );
    }

    return (
      <Dialog
        onRequestClose={this.handleRequestClose}
        fullScreen={fullScreen}
        transition={Transition}
        open={courseDetails.show}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <List>
            <ListItem>
              <ListItemIcon>
                <FaCalendarO/>
              </ListItemIcon>
              <div>
                <TextField id="start_date" label="Kursdatum" type="date" value={moment(start).format("YYYY-MM-DD")} fullWidth/>
              </div>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <FaClockO/>
              </ListItemIcon>
              <div>
                <TextField id="start_time" label="Kursbeginn" type="time" value={moment(start).format("hh:mm")} fullWidth/>
              </div>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <FaClockO/>
              </ListItemIcon>
              <div>
                <TextField id="end_time" label="Kursende" type="time" value={moment(start).add(minutes, 'minute').format("hh:mm")} fullWidth/>
              </div>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <FaUserMd/>
              </ListItemIcon>
              <div>
                <TextField id="instructor" label="Kursleiter" value={instructor.firstname + " " + instructor.lastname} fullWidth/>
              </div>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <FaMapMarker/>
              </ListItemIcon>
              <ListItemText
                inset
                primary={"Kuhstall"}
                secondary={"irgendwo in Toppenstedt"}/>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <FaUser/>
              </ListItemIcon>
              <div>
                <TextField id="maxParticipanrs" label="Max. Kursteilnehmer" type="number" value={maxParticipants} fullWidth/>
              </div>
            </ListItem>
            <ListItem button onClick={toggleAttendeeList}>
              <ListItemIcon>
                <FaUser/>
              </ListItemIcon>
              <ListItemText
                inset
                primary={"Teilnemer (" + attendees.length + ")"}/>
              {courseDetails.showAttendees ? <MdExpandLess /> : <MdExpandMore />}
            </ListItem>

            <Collapse component="li" in={courseDetails.showAttendees} timeout="auto" unmountOnExit>
              <List disablePadding>
                {attendeesList}
              </List>
            </Collapse>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleRequestClose} color="primary">
            Schließen
          </Button>
          <Button onClick={this.signInOut} color="primary">
            {signedIn ? "Abmelden" : "Teilnehmen"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withMobileDialog()(CourseDetails);