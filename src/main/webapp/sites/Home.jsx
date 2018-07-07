'use strict';
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import compose from 'recompose/compose';
import withWidth, {isWidthDown} from '@material-ui/core/withWidth';
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
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {Slider, Subheader} from './../components/general';
import {NewsItem} from './../components/news';
import Course, {CourseList} from './../components/course';
import {showCourseDetails} from '../model/courses';
import {IconBatteryLow, IconCalendar} from '../utils/Icons';
import {red} from '@material-ui/core/colors';
import {LoginAndRegistrationCard} from '../components/account';
import {MenuLink} from '../components/general';
import {showNotification} from "../model/notification";

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
            Achtung, Deine 10er-Karte ist bald voll. Denke daran, Dir eine neue zu kaufen :-)
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
    const {user, classes, width} = this.props;
    if (user) {
      return undefined;
    }
    const suffix = isWidthDown('sm', width) ? 'xs' : 'md';
    return (
      <Grid item xs={12} md={8}>
        <Card>
          <CardMedia
            component={'img'}
            image={__API__ + '/welcome_' + suffix + '.jpg'}
            title={'Welcome'}
          />
          <CardContent>
            <Typography variant='title'>Willkommen im FreyRaum</Typography>
            <Typography>Funktionelles Training in familiärer Atmosphäre.</Typography>
            <Typography>Mit der Gründung von FreyRaum entsteht in Toppenstedt ein für die Gegend einzigartiges Konzept. Ein Raum indem vor allem der Spaß an Bewegung an erster Stelle steht und ein abwechslungsreiches Trainingsprogramm wartet.
              Jedes Mal anders, jedes Mal Neu!</Typography>
            <Typography>Neben dem breiten Kursprogramm, können Mitglieder auch zum eigenständigen bzw. freien Training vorbei kommen.</Typography>
          </CardContent>
        </Card>
      </Grid>
    )
  };

  getNews = () => {
    const newsData = this.props.news.data || [];
    return <Grid item xs={12} md={8}>
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

  getUpcomingCourses = () => {
    const {data = {}} = this.props.courses;
    const notifyUser = () => this.props.actions.showNotification('Bitte melde dich, um weitere Details zu sehen');
    return (
      <Grid item xs={12} md={8}>
        <Card>
          <CardHeader title={'Anstehende Kurse'}/>
          <CardContent style={{maxHeight: '300px', overflow: 'auto', padding: '0px'}}>
            <CourseList courses={data} showCourseDetails={notifyUser}/>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  getCoursePlan = () => {

    const data = [
      {
        time: '07:00-07:45',
        mo: 'KRAFT & TECHNIK',
        mi: 'FUN.BASE'
      },
      {
        time: '09:00-10:00',
        mo: 'FUN.POWER',
        di: 'FUN.BASE',
        mi: 'FUN.POWER',
        fr: 'FUN.POWER'
      },
      {
        time: '10:00-11:00',
        mo: 'TRX FIT MOMS',
        di: 'BEST AGER CLASS (65+)',
        mi: 'FUN.BASE',
        do: 'FUN.BASE',
      },
      {
        time: '11:00-11:45',
        di: 'FUN.POWER',
        mi: 'TRX FIT MOMS',
        fr: 'TRX FIT MOMS',
        sa: <span><Typography variant='caption' style={{color: 'lightgrey'}}>11:00-12:00</Typography>FUN.TEAM</span>,
      },
      {
        time: '16:30-17:30',
        do: 'KRAFT & TECHNIK',
        fr: 'KRAFT & TECHNIK'
      },
    ];

    return (
      <Grid item xs={12} md={8}>
        <Card>
          <CardHeader title={'Kursplan'}/>
          <CardContent style={{overflowX: 'auto'}}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Zeit</TableCell>
                  <TableCell numeric>Montag</TableCell>
                  <TableCell numeric>Dienstag</TableCell>
                  <TableCell numeric>Mittwoch</TableCell>
                  <TableCell numeric>Donnerstag</TableCell>
                  <TableCell numeric>Freitag</TableCell>
                  <TableCell numeric>Samstag</TableCell>
                  <TableCell numeric>Sonntag</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((n, idx) => {
                  return (
                    <TableRow key={idx}>
                      <TableCell component="th" scope="row">
                        {n.time}
                      </TableCell>
                      <TableCell numeric>{n.mo}</TableCell>
                      <TableCell numeric>{n.di}</TableCell>
                      <TableCell numeric>{n.mi}</TableCell>
                      <TableCell numeric>{n.do}</TableCell>
                      <TableCell numeric>{n.fr}</TableCell>
                      <TableCell numeric>{n.sa}</TableCell>
                      <TableCell numeric>{n.so}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  getLoginCard = () => {
    if (this.props.user) {
      return undefined;
    }
    return <Grid item xs={12} sm={8} md={6}>
      <LoginAndRegistrationCard/>
    </Grid>;
  };

  getUserDetails = () => {
    const signedIn = !!this.props.user;
    if (!signedIn) {
      return undefined;
    }
    return <Grid item xs={12} md={8} style={{padding: '0px'}}>
      <List style={{padding: '0'}}>
        {this.getMyCourses()}
        <Subheader label={"Status"}/>
        <ListItem button
            onClick={this.handleClickOpen}>
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
    return (
      <div style={{height: '100%', overflow: 'scroll', WebkitOverflowScrolling: 'touch'}}>
        <Grid container spacing={16} justify="center" style={{width: '100%', margin: '0px'}}>
          <SimpleDialog
            open={this.state.open}
            onClose={this.handleRequestClose}/>
          {/* Nur bei nicht angemeldeten Benutzern*/}
          {this.getWelcomeGreetings()}
          {this.getNews()}
          {/* weitere Informationen bei angemeldeten Benutzern */}
          {this.getUserDetails()}
          {/* Der Kursplan */}
          {this.getCoursePlan()}
          {/* Nur bei nicht angemeldeten Benutzern*/}
          {this.getLoginCard()}
        </Grid>
      </div>
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
    showCourseDetails: showCourseDetails,
    // notification
    showNotification: showNotification
  }, dispatch),
  dispatch
});

export default compose(
  withWidth(),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Home);