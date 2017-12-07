import React, {Component} from 'react';
import moment from 'moment';
import Grid from 'material-ui/Grid';
import List, {ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction} from 'material-ui/List';
import Button from 'material-ui/Button';
import Dialog, {DialogTitle, DialogContent, DialogActions, DialogContentText} from 'material-ui/Dialog';
import Course, {TypeMapper} from './../components/course';

import {FaCalendarO, FaClockO, FaMapMarker, FaUser} from 'react-icons/lib/fa';

class SimpleDialog extends Component {
  handleRequestClose = () => {
    this.props.onRequestClose();
  };

  render() {
    const {courseDetails} = this.props;
    let title = 'pending...';
    if (!courseDetails.show || courseDetails.pending) {
      return null;
    }

    if (!courseDetails.pending && courseDetails.show) {
      const {label, icon, color} = TypeMapper[courseDetails.details.type];
      title = (<span><span>{icon({color: color, style: {marginRight: '12px'}})}</span><span>{label}</span></span>);
    }

    return (
      <Dialog onRequestClose={this.handleRequestClose} open={courseDetails.show}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <List>
              <ListItem>
                <ListItemIcon>
                  <FaCalendarO/>
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={moment(courseDetails.details.start).format('DD.MM.YYYY HH:mm')}
                  secondary={moment(courseDetails.details.start).format('dddd')}/>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <FaClockO/>
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={courseDetails.details.minutes + " Minuten"}
                  secondary={"Mit " + courseDetails.details.instructor}/>
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
                <ListItemText
                  inset
                  primary={"Teilnemer"}
                  secondary={courseDetails.details.attendees.concat(', ')}/>
              </ListItem>
            </List>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleRequestClose} color="primary">
            Schließen
          </Button>
          <Button onClick={this.handleRequestClose} color="primary">
            Teilnehmen
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

class Courses extends Component {
  render() {
    const {courses, showCourseDetails, hideCourseDetails, courseDetails} = this.props;
    console.warn("courseDetails", courseDetails);
    return (
      <Grid container spacing={16} justify="center" style={{width: '100%'}}>
        <SimpleDialog
          courseDetails={courseDetails}
          onRequestClose={hideCourseDetails}
        />
        <Grid item xs={12} md={12}>
          <List>
          {
            courses.map((course, idx) => (
              <Course key={idx} course={course} showCourseDetails={showCourseDetails}/>
            ))
          }
          </List>
        </Grid>
      </Grid>
    );
  }
}

export default Courses;