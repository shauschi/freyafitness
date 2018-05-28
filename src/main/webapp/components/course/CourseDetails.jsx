'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import InputAdornment from '@material-ui/core/InputAdornment';
import Grid from '@material-ui/core/Grid';
import {ValidationGroup} from './../general/validation';
import {
  Dialog,
  GridInputControl,
  GridDateTimeControl,
  GridItemSelectControl, GridTextControl
} from './../general';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import {TypeMapper} from '.';
import * as Format from '../../utils/Format';
import {ProfilePicture} from './../profile';
import {showNotification} from './../../model/notification';
import {MODE, NEW_COURSE} from './../../model/courses';
import {TITLE_BG} from '../../utils/Style';
import {IconPencil} from '../../utils/Icons';

import {findById} from '../../utils/RamdaUtils';
import {LoadingIndicator} from '../general';
import {
  fetchCourses,
  hideCourseDetails,
  onCourseDetailsChange,
  saveCourseDetails,
  signIn,
  signOut,
  toggleAttendeeList,
  toggleEditCourse
} from '../../model/courses';

const getAttendeeList = attendees =>
  attendees.map((user, idx) =>
    <Grid item xs={3} key={idx}>
      <Avatar style={{backgroundColor: TITLE_BG, margin: '0 auto'}}>
        <ProfilePicture user={user} />
      </Avatar>
      <Typography style={{width: '100%', textAlign: 'center', marginTop: '4px'}}>
        {user.firstname}
        </Typography>
      <Typography style={{width: '100%', textAlign: 'center'}}>
        {user.lastname}
      </Typography>
    </Grid>
  );

class CourseDetails extends Component {

  handleRequestClose = () => {
    // TODO unsaved 000_user?
    this.props.actions.hideCourseDetails();
  };

  handleRequestSave = () => {
    // TODO onRequestSave
    this.props.actions.saveCourseDetails(this.props.course);
  };

  signInOut = () => {
    const {course = {}} = this.props.courseDetails;
    const {id, signedIn} = course;
    if (signedIn) {
      this.props.actions.signOut(id);
      this.handleRequestClose();
    } else {
      this.props.actions.signIn(id);
      this.handleRequestClose();
    }
  };

  render() {
    const {
      courseDetails = {},
      pending,
      currentUser = {},
      courseTypes,
      actions} = this.props;
    const {
      show,
      mode = MODE.CREATE,
      showAttendees,
      course = NEW_COURSE
    } = courseDetails;
    const {
      toggleAttendeeList,
      toggleEditCourse,
      onCourseDetailsChange
    } = actions;

    const {title, readonly} = mode;
    const {start, courseTypeId, minutes, attendees = [],
      instructor = {}, maxParticipants, signedIn} = course;
    const attendeesList = getAttendeeList(attendees);

    if (pending) {
      return <LoadingIndicator/>;
    }

    const {name = " ", color} = findById(courseTypes.data, courseTypeId) || TypeMapper['SOFT'];
    const short = name.charAt(0);
    const {roles = {}} = currentUser;
    return (
      <Dialog
        title={title}
        onClose={this.handleRequestClose}
        secondAction={
          (mode === MODE.VIEW && (roles.ADMIN || roles.TRAINER))
            ? <IconButton onClick={toggleEditCourse}>
                <IconPencil/>
              </IconButton>
            : undefined
        }
        open={show}>
        <DialogContent style={{padding: '0', paddingTop: '12px'}}>
          <Grid container spacing={8} style={{width: '100%', margin: '0px', padding: '16px'}}>
            <ValidationGroup ref={this.setValidation}>
              <Grid item xs={2} style={{margin: 'auto'}}>
                <Avatar style={{backgroundColor: color}}>
                  <span>{short}</span>
                </Avatar>
              </Grid>
              <GridItemSelectControl
                xs={10}
                id='type'
                readonly={readonly}
                label='Kurstyp'
                value={courseTypeId}
                values={courseTypes.data}
                keyProp='id'
                valueProp='name'
                onChange={value => onCourseDetailsChange('courseTypeId', value)}
              />
              <GridDateTimeControl
                xs={8}
                id='start_date'
                label='Kursbeginn'
                type='date'
                readonly={readonly}
                value={moment(start)}
                onChange={value => {
                  if (!value.isValid()) {
                    return;
                  }
                  onCourseDetailsChange('start', value.format(Format.TIMESTAMP_FORMAT));
                }}
              />
              <GridInputControl
                xs={4}
                id='duration'
                label='Dauer'
                type='number'
                readonly={readonly}
                value={minutes}
                onChange={value => onCourseDetailsChange('minutes', Number.parseInt(value))}
                endAdornment={<InputAdornment position="end">Minuten</InputAdornment>}
              />
              <Grid item xs={2} style={{margin: 'auto'}}>
                <Avatar style={{backgroundColor: TITLE_BG}}>
                  <ProfilePicture user={instructor} />
                </Avatar>
              </Grid>
              <GridInputControl
                xs={10}
                id='instructor'
                label='Kursleitung'
                readonly={true}
                value={instructor.firstname}
                onChangte={() => {}}
              />
              <GridInputControl
                xs={6}
                id='location'
                label='Ort'
                readonly={true}
                value='Toppenstedt'
                onChange={() => {}}
              />
              <GridInputControl
                xs={6}
                id='maxParticipants'
                label='max. Teilnehmer'
                type='number'
                readonly={readonly}
                value={maxParticipants}
                onChange={value => onCourseDetailsChange('maxParticipants', Number.parseInt(value))}
              />
              <GridTextControl text={'Teilnehmer'}/>
              {attendeesList}
            </ValidationGroup>
          </Grid>
        </DialogContent>

        <DialogActions>
          {
            mode === MODE.VIEW
            ? <Button key='course-details-button-1-a' color='primary' onClick={this.signInOut}>
                {signedIn ? 'Abmelden' : 'Teilnehmen'}
              </Button>
            : <Button key='course-details-button-1-b' color='primary' onClick={this.handleRequestSave}>
                {'Speichern'}
              </Button>
          }
          {
            mode === MODE.VIEW
              ? <Button key='course-details-button-2-a' onClick={this.handleRequestClose}>
                {'Schließen'}
              </Button>
              : <Button key='course-details-button-2-b' onClick={mode === MODE.MODIFY ? toggleEditCourse : this.handleRequestClose}>
                {'Abbrechen'}
              </Button>
          }
        </DialogActions>
      </Dialog>
    );
  };
}

const mapStateToProps = state => ({
  currentUser: state.profile.user,
  courseTypes: state.courseTypes,
  courseDetails: state.courses.courseDetails
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    showNotification: showNotification,
    // courses
    fetchCourses: fetchCourses,
    hideCourseDetails: hideCourseDetails,
    saveCourseDetails: saveCourseDetails,
    toggleAttendeeList: toggleAttendeeList,
    toggleEditCourse: toggleEditCourse,
    onCourseDetailsChange: onCourseDetailsChange,
    signIn: signIn,
    signOut: signOut,
  }, dispatch),
  dispatch
});


export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(CourseDetails);