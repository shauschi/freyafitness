import React, {Component} from 'react';
import moment from 'moment';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';
import List, {ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction} from 'material-ui/List';

import {FaCloud, FaInfo} from 'react-icons/lib/fa';
import {green} from 'material-ui/colors';

class Courses extends Component {
  render() {
    return (
      <Grid container spacing={16} justify="center" style={{width: '100%'}}>
        <Grid item xs={12} md={12}>
          <List>
          {
            this.props.courses.map((course, idx) => (
              <ListItem key={idx}>
                <ListItemIcon>
                  <FaCloud color={green.A200}/>
                </ListItemIcon>
                <ListItemText inset primary={course.type} secondary={moment(course.start).format("dd, HH:mm") + " mit " + course.instructor}/>
                <ListItemSecondaryAction>
                  <IconButton aria-label="Comments">
                    <FaInfo />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          }
          </List>
        </Grid>
      </Grid>
    );
  }
}

export default Courses;