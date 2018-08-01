'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import withWidth, {isWidthDown} from '@material-ui/core/withWidth';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import List from '@material-ui/core/List';
import {Slider, Subheader} from './../components/general';
import {NewsItem} from './../components/news';
import Course from './../components/course';
import {showCourseDetails, signIn, signOut} from '../model/courses';
import {IconCalendar} from '../utils/Icons';
import {LoginAndRegistrationCard} from '../components/account';
import {MenuLink} from '../components/general';
import {showNotification} from "../model/notification";
import {withStyles} from "@material-ui/core/styles/index";
import * as Style from "../utils/Style";
import {ContactCard} from "../components/contact/";
import FacebookProvider, {Page} from 'react-facebook';
import moment from "moment/moment";
import {comparingMod, comparingModFunc, DESC} from "../utils/Comparator";

const compareCourseByStartDate = comparingMod('start', moment);
const compareNewsByValidityFromDate = comparingModFunc(news => news.validity.from, moment, DESC);

class Home extends Component {

  getWelcomeGreetings = () => {
    const {user, width} = this.props;
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
            <Typography variant='title' style={{marginBottom: '8px'}}>Willkommen im FreyRaum</Typography>
            <Typography>Funktionelles Training in familiärer Atmosphäre.</Typography>
            <Typography>Mit der Gründung von FreyRaum entsteht in Toppenstedt ein für die Gegend einzigartiges Konzept. Ein Raum, in dem vor allem der Spaß an Bewegung an erster Stelle steht und ein abwechslungsreiches Trainingsprogramm wartet.
              Jedes Mal anders, jedes Mal neu!</Typography>
            <Typography>Neben dem breiten Kursprogramm, können Mitglieder auch zum eigenständigen bzw. freien Training vorbei kommen.</Typography>
          </CardContent>
        </Card>
      </Grid>
    )
  };

  getNews = () => {
    const newsData = this.props.news.data || [];
    newsData.sort(compareNewsByValidityFromDate);
    return <Grid item xs={12} md={8}>
      <Card>
        <Slider loading={this.props.news.pending}>
          {newsData.map((newsItem, idx) => (
            <NewsItem
              key={idx}
              title={newsItem.title}
              teaser={newsItem.teaser}
              text={newsItem.text}
              validity={newsItem.validity}
              img={__API__ + '/test' + newsItem.pictureId + '.jpg'}/>
          ))}
        </Slider>
      </Card>
    </Grid>
  };

  getCoursePlan = () => {
    if (this.props.user) {
      return undefined;
    }

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
      {
        time: '17:30-18:30',
        mo: 'FUN.POWER',
        di: 'FUN.POWER',
        mi: 'FUN.POWER',
        do: 'FUN.BASE',
        fr: 'FUN.TEAM'
      },
      {
        time: '18:30-19:30',
        mo: 'FUN.BASE',
        di: 'FUN.BASE',
        mi: 'FUN.BASE',
        do: 'FUN.POWER',
        so: 'FUN.TEAM'
      },
      {
        time: '19:30-20:30',
        mo: 'FUN.BASE',
        di: 'FUN.BASE',
        mi: 'FUN.TEAM',
        do: 'MÄNNER ABEND',
      },
      {
        time: '20:30-21:30',
        mo: 'FUN.POWER',
        di: 'FUN.POWER',
        mi: 'FUN.POWER',
      }
    ];

    const {classes} = this.props;
    const Cell = ({children, numeric}) => <TableCell
      numeric={numeric}
      className={classes.courseCell}
      >
      {children}
    </TableCell>;

    return (
      <Grid item xs={12} md={8}>
        <Card>
          <CardHeader title={'Kursplan'}/>
          <CardContent>
            <Typography>Hier findest du den allgemeinen Kursplan. Für Details zu den Kursen und freien Plätzen, melde dich einfach an.</Typography>
            <div style={{overflowX: 'auto'}}>
              <Table>
              <TableHead>
                <TableRow>
                  <Cell>Zeit</Cell>
                  <Cell numeric>Montag</Cell>
                  <Cell numeric>Dienstag</Cell>
                  <Cell numeric>Mittwoch</Cell>
                  <Cell numeric>Donnerstag</Cell>
                  <Cell numeric>Freitag</Cell>
                  <Cell numeric>Samstag</Cell>
                  <Cell numeric>Sonntag</Cell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((n, idx) => {
                  return (
                    <TableRow key={idx}>
                      <Cell component="th" scope="row">
                        {n.time}
                      </Cell>
                      <Cell numeric>{n.mo}</Cell>
                      <Cell numeric>{n.di}</Cell>
                      <Cell numeric>{n.mi}</Cell>
                      <Cell numeric>{n.do}</Cell>
                      <Cell numeric>{n.fr}</Cell>
                      <Cell numeric>{n.sa}</Cell>
                      <Cell numeric>{n.so}</Cell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            </div>
            <Typography variant='subheading' style={{marginTop: '8px'}}>FUN.BASE</Typography>
            <Typography>Der Einstieg. Die Grundlage des funktionalen Trainings</Typography>
            <Typography variant='subheading' style={{marginTop: '8px'}}>FUN.POWER</Typography>
            <Typography>Das volle Programm. Immer neue Herausforderungen. Schweißtreibend!</Typography>
            <Typography variant='subheading' style={{marginTop: '8px'}}>FUN.TEAM</Typography>
            <Typography>Teamwork. Wir nutzen die Grundübungen und arbeiten uns gemeinsam ans Ziel.</Typography>
            <Typography variant='subheading' style={{marginTop: '8px'}}>KRAFT & TECHNIK</Typography>
            <Typography>Man lernt nie aus. Techniktraining und Gewichte steigern.</Typography>
            <Typography variant='subheading' style={{marginTop: '8px'}}>FIT MOMS</Typography>
            <Typography>Mutter & Kind Zeit. Nach der Rückbildungsgymnastik mit dem Kind gemeinsam fit werden.</Typography>
            <Typography variant='subheading' style={{marginTop: '8px'}}>MÄNNER ABEND</Typography>
            <Typography>Krafttraining. Technik erlernen und gemeinsam Gewichte bewegen.</Typography>
            <Typography variant='subheading' style={{marginTop: '8px'}}>BEST AGERS(65+)</Typography>
            <Typography>Da geht noch was. Funktionelles Training, egal in welchem Alter.</Typography>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  getLoginCard = () => {
    if (this.props.user) {
      return undefined;
    }
    return <Grid item xs={12} sm={8} md={5}>
      <LoginAndRegistrationCard/>
    </Grid>;
  };

  getFacebookEventCard = () => (
    <Grid item xs={12} sm={8} md={5}>
      <Card>
        <CardHeader title='FreyRaum auf facebook'/>
        <CardContent>
          <Typography style={{paddingBottom: '16px'}}>
            Hier siehst du bevorstehende Veranstaltungen auf facebook. Gerne darfst du die Seite auch mit deinen Freunden teilen.
          </Typography>
          <FacebookProvider
            appId="1801602199870336"
            language='de_DE'>
            <div style={{textAlign: 'center'}}>
              <Page
                href="https://www.facebook.com/freyraum.fitness/"
                adaptContainerWidth
                tabs="events"/>
            </div>
          </FacebookProvider>
        </CardContent>
      </Card>
    </Grid>
  );

  getUserDetails = () => {
    const signedIn = !!this.props.user;
    if (!signedIn) {
      return undefined;
    }

    const {showCourseDetails, signIn, signOut} = this.props.actions;
    const {data = {}} = this.props.courses;
    const myCourses = data.filter(course => course.signedIn);
    myCourses.sort(compareCourseByStartDate);

    return <Grid item xs={12} sm={8} md={8}>
      <Card>
        <List style={{padding: '0'}}>
          <Subheader label='Meine Kurse'/>
          {
            myCourses.length === 0
              ? <MenuLink
                to='/courses/all' label='Melde dich hier zu Kursen an'
                icon={<IconCalendar/>}/>
              : myCourses.map(
              (course, idx) => (
                <Course
                  key={idx}
                  course={course}
                  showCourseDetails={showCourseDetails}
                  signIn={signIn}
                  signOut={signOut}
                  showDate/>)
              )
          }
        </List>
      </Card>
    </Grid>;
  };

  render() {
    return (
      <div className={this.props.classes.root}>
        <Grid container spacing={16} justify="center" style={{width: '100%', margin: '0px'}}>
          {/* Nur bei nicht angemeldeten Benutzern*/}
          {this.getWelcomeGreetings()}
          {this.getNews()}
          {/* weitere Informationen bei angemeldeten Benutzern */}
          {this.getUserDetails()}
          {/* Der Kursplan */}
          {this.getCoursePlan()}
          {/* Kontaktaufnahme */}
          <ContactCard/>
          {/* Nur bei nicht angemeldeten Benutzern */}
          {this.getLoginCard()}
          {/* Bevorstehende Veranstaltungen */}
          {this.getFacebookEventCard()}
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
    signIn: signIn,
    signOut: signOut,
    // notification
    showNotification: showNotification
  }, dispatch),
  dispatch
});

export default compose(
  withWidth(),
  withStyles(Style.APP_STYLES, {withTheme: true}),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Home);