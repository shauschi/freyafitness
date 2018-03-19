'use strict';
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Dialog, {DialogTitle, DialogContent, DialogActions, DialogContentText} from 'material-ui/Dialog';
import List, {ListItem, ListItemIcon, ListItemText} from 'material-ui/List';
import {Subheader, Slider} from './../components/general';
import {NewsItem} from './../components/news';
import Course from './../components/course';
import {
  showCourseDetails
} from '../model/courses';

import {IconBatteryLow} from '../utils/Icons';
import {red} from 'material-ui/colors';

class SimpleDialog extends Component {

  handleRequestClose = () => {
    this.props.onClose(this.props.selectedValue);
  };

  render() {
    const {...other} = this.props;

    return (
      <Dialog onClose={this.handleRequestClose} {...other}>
        <DialogTitle><IconBatteryLow color={red.A200} style={{marginRight: '12px'}}/>10er-Karte</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Achtung, Deine 10er-Karte ist bald voll. Denke daran, dir eine neue zu kaufen :-)
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleRequestClose} color="primary">
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

class Home extends Component {

  state = {
    open: false
  };

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleRequestClose = () => {
    this.setState({open: false });
  };

  getMyCourses = () => {
    const {showCourseDetails} = this.props.actions;
    const {data = {}} = this.props.courses;
    const myCourses = data.filter(course => course.signedIn);
    if (myCourses && myCourses.length > 0) {
      return (
        <div>
          <Subheader label='Meine Kurse'/>
          {myCourses.map(
            (course, idx) => (
              <Course
                key={idx}
                course={course}
                showCourseDetails={showCourseDetails}
                showDate/>)
          )}
        </div>
      );
    }
  };

  render() {
    // TODO besser an die einzelnen Komponenten übergeben
    const newsData = this.props.news.data || [];
    return (
      <Grid container spacing={16} justify="center" style={{width: '100%', margin: '0px'}}>
        <SimpleDialog
          open={this.state.open}
          onClose={this.handleRequestClose}/>

        <Grid item xs={12} md={12} style={{padding: '0px'}}>
          {/* Neuigkeiten, autoscroll, 1 bis 5 Elemente, default=Willkommen */}
          <Slider loading={this.props.news.pending}>
            {newsData.map((newsItem, idx) => (
              <NewsItem
                key={idx}
                title={newsItem.title}
                text={newsItem.teaser}
                img={__API__ + '/test' + newsItem.pictureId + '.jpg'}/>
            ))}
          </Slider>

          <List style={{padding: '0'}}>
            {this.getMyCourses()}
            <Subheader label={"Status"}/>
            <ListItem button onClick={this.handleClickOpen}>
              <ListItemIcon>
                <IconBatteryLow color={red.A200}/>
              </ListItemIcon>
              <ListItemText inset primary={"Zehnerkarte"} secondary={"(8 von 10 verbraucht)"}/>
            </ListItem>
            <ListItem button onClick={this.handleClickOpen}>
              <ListItemIcon>
                <IconBatteryLow color={red.A200}/>
              </ListItemIcon>
              <ListItemText inset primary={"Zehnerkarte"} secondary={"(8 von 10 verbraucht)"}/>
            </ListItem>
            <ListItem button onClick={this.handleClickOpen}>
              <ListItemIcon>
                <IconBatteryLow color={red.A200}/>
              </ListItemIcon>
              <ListItemText inset primary={"Zehnerkarte"} secondary={"(8 von 10 verbraucht)"}/>
            </ListItem>
          </List>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  courses: state.courses,
  news: state.news
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    // courses
    showCourseDetails: showCourseDetails,
  }, dispatch),
  dispatch
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);