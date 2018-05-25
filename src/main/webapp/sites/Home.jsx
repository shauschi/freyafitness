'use strict';
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {Slider, Subheader} from './../components/general';
import {NewsItem} from './../components/news';
import Course from './../components/course';
import {showCourseDetails} from '../model/courses';
import {IconBatteryLow, IconCalendar} from '../utils/Icons';
import {red} from '@material-ui/core/colors';
import {LoginAndRegistrationCard} from '../components/account';
import {MenuLink} from '../components/general';

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

  getWelcomeGreetings = () => {
    const {user} = this.props;
    if (user) {
      return undefined;
    }
    return (
      <Grid item xs={12} sm={9}>
        <Card>
          <CardHeader title={'Willkommen'}/>
          <CardMedia
            src={__API__ + '/test1.png'}
            style={{height: '250px', background: 'blue'}}
          />
          <CardContent>
            <Typography>Lorem ipsum Beispueltext.</Typography>
            <Typography>Noch mehr Text, der dann gerne noch mal ersetzt werden sollte. Hier könnte irgendwas kurzes stehen über "das bin ich und das biete ich an". Später kommen dann die Nachrichten, also XLETICS, neuer Raum, Yoga.</Typography>
          </CardContent>
        </Card>
      </Grid>
    )
  };

  getNews = () => {
    const newsData = this.props.news.data || [];
    return <Grid item xs={12} sm={9} style={{padding: '0px'}}>
      <Slider loading={this.props.news.pending}>
        {newsData.map((newsItem, idx) => (
          <NewsItem
            key={idx}
            title={newsItem.title}
            text={newsItem.teaser}
            img={__API__ + '/test' + newsItem.pictureId + '.jpg'}/>
        ))}
      </Slider>
    </Grid>
  };

  getMyCourses = () => {
    const {showCourseDetails} = this.props.actions;
    const {data = {}} = this.props.courses;
    const myCourses = data.filter(course => course.signedIn);
    return (
      <div>
        <Subheader label='Meine Kurse'/>
        {myCourses.length === 0
          ? <MenuLink
              to='/courses/all' label='Melde dich hier zu Kursen an'
              icon={<IconCalendar/>}/>
          : myCourses.map(
            (course, idx) => (
              <Course
                key={idx}
                course={course}
                showCourseDetails={showCourseDetails}
                showDate/>)
            )
        }
      </div>
    );
  };

  getLoginCard = () => {
    if (this.props.user) {
      return undefined;
    }
    return <Grid item xs={12} sm={6}>
      <LoginAndRegistrationCard/>
    </Grid>;
  };

  getUserDetails = () => {
    if (!this.props.user) {
      return undefined;
    }
    return <Grid item xs={12} sm={9} style={{padding: '0px'}}>
      <List style={{padding: '0'}}>
        {/* TODO Das ganze mal als GridList ausprobieren */}
        {this.getMyCourses()}
        <Subheader label={"Status"}/>
        <ListItem button onClick={this.handleClickOpen}>
          <ListItemIcon>
            <IconBatteryLow color={red.A200}/>
          </ListItemIcon>
          <ListItemText
            inset
            primary={"Zehnerkarte"}
            secondary={"(zukünftig kannst du hier deine Karten verwalten)"}/>
        </ListItem>
      </List>
    </Grid>;
  };

  render() {
    // TODO besser an die einzelnen Komponenten übergeben
    return (
      <Grid container spacing={16} justify="center" style={{width: '100%', margin: '0px'}}>
        <SimpleDialog
          open={this.state.open}
          onClose={this.handleRequestClose}/>
        {/* Nur bei nicht angemeldeten Benutzern*/}
        {this.getWelcomeGreetings()}
        {this.getNews()}
        {/* Nur bei nicht angemeldeten Benutzern*/}
        {this.getLoginCard()}
        {/* Nur bei angemeldeten Benutzern*/}
        {this.getUserDetails()}
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  user: state.profile.user,
  courses: state.courses,
  news: state.news
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    // courses
    showCourseDetails: showCourseDetails
  }, dispatch),
  dispatch
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);