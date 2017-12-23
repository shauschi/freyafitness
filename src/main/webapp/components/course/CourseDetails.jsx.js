'use strict';
import React, {Component} from 'react';
import moment from 'moment';
import List, {ListItem, ListItemText, ListItemIcon} from 'material-ui/List';
import Button from 'material-ui/Button';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  withMobileDialog
} from 'material-ui/Dialog';
import {TypeMapper} from ".";

import {FaCalendarO, FaClockO, FaMapMarker, FaUser} from 'react-icons/lib/fa';

class CourseDetails extends Component {
  handleRequestClose = () => {
    this.props.onRequestClose();
  };

  render() {
    const {courseDetails, fullScreen} = this.props;
    let title = 'pending...';
    if (!courseDetails.show || courseDetails.pending) {
      return null;
    }

    if (!courseDetails.pending && courseDetails.show) {
      const {label, icon, color} = TypeMapper[courseDetails.details.type];
      title = (<span><span>{icon({color: color, style: {marginRight: '12px'}})}</span><span>{label}</span></span>);
    }

    return (
      <Dialog
        onRequestClose={this.handleRequestClose}
        fullScreen={fullScreen}
        open={courseDetails.show}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
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

export default withMobileDialog()(CourseDetails);