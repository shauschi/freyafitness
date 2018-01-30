import React, {Component} from 'react';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import Dialog, {DialogTitle, DialogContent, DialogActions, DialogContentText} from 'material-ui/Dialog';
import List, {ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction} from 'material-ui/List';
import {Subheader, NewsSlider, NewsItem} from './../components/general';
import Course from './../components/course';

import {FaInfo, FaBattery1} from 'react-icons/lib/fa';
import {red} from 'material-ui/colors';


class SimpleDialog extends Component {

  handleRequestClose = () => {
    this.props.onClose(this.props.selectedValue);
  };

  render() {
    const {...other} = this.props;

    return (
      <Dialog onClose={this.handleRequestClose} {...other}>
        <DialogTitle><FaBattery1 color={red.A200} style={{marginRight: '12px'}}/>10er-Karte</DialogTitle>
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


  render() {
    // TODO besser an die einzelnen Komponenten übergeben
    const newsData = this.props.news.data || [];
    const {data = {}} = this.props.courses;
    const {showCourseDetails} = this.props.actions;
    const myCourses = data.filter(course => course.signedIn);
    return (
      <Grid container spacing={16} justify="center" style={{width: '100%', margin: '0px'}}>
        <SimpleDialog
          open={this.state.open}
          onClose={this.handleRequestClose}/>

        <Grid item xs={12} md={12} style={{padding: '0px'}}>
          {/* Neuigkeiten, autoscroll, 1 bis 5 Elemente, default=Willkommen */}
          <NewsSlider loading={this.props.news.pending}>
            {newsData.map((newsItem, idx) => (
              <NewsItem
                key={idx}
                title={newsItem.title}
                text={newsItem.teaser}
                img={'http://localhost:9000/test' + newsItem.pictureId + '.jpg'}/>
            ))}
          </NewsSlider>

          <List>
            <Subheader label={"Meine Kurse"}/>
            { myCourses.map(
              (course, idx) => (<Course key={idx} course={course} showCourseDetails={showCourseDetails}/>)
            )}

            <Subheader label={"Status"}/>
            <ListItem button onClick={this.handleClickOpen}>
              <ListItemIcon>
                <FaBattery1 color={red.A200}/>
              </ListItemIcon>
              <ListItemText inset primary={"Zehnerkarte"} secondary={"(8 von 10 verbraucht)"}/>
            </ListItem>
            <ListItem button onClick={this.handleClickOpen}>
              <ListItemIcon>
                <FaBattery1 color={red.A200}/>
              </ListItemIcon>
              <ListItemText inset primary={"Zehnerkarte"} secondary={"(8 von 10 verbraucht)"}/>
            </ListItem>
            <ListItem button onClick={this.handleClickOpen}>
              <ListItemIcon>
                <FaBattery1 color={red.A200}/>
              </ListItemIcon>
              <ListItemText inset primary={"Zehnerkarte"} secondary={"(8 von 10 verbraucht)"}/>
            </ListItem>
          </List>
        </Grid>
      </Grid>
    );
  }
}

export default Home;