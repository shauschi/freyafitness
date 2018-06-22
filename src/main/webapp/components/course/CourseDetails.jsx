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
import Paper from '@material-ui/core/Paper';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
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
import {IconUserAdd, IconDelete, IconPencil, IconUser} from '../../utils/Icons';
import {setPath, view, viewPath} from '../../utils/RamdaUtils';

import {findById} from '../../utils/RamdaUtils';
import {LoadingIndicator} from '../general';
import {
  fetchCourses,
  hideCourseDetails,
  onCourseDetailsChange,
  saveCourseDetails,
  signIn,
  signOut,
  toggleEditCourse,
  addUserToCourse,
  removeUserFromCourse
} from '../../model/courses';
import {
  updateUsers
} from '../../model/profile';

class CourseDetails extends Component {

  state = {
    user: {
      anchor: null,
      user: null
    },
    addUser: {
      anchor: null
    }
  };

  openMenu = (event, user) => {
    this.setState(setPath(['user'], {anchor: event.currentTarget, user: user}, this.state));
  };

  closeMenu = () => {
    this.setState(setPath(['user'], {anchor: null, user: null}, this.state));
  };

  getUserMenu = () => {
    const {anchor, user} = this.state.user;
    const {removeUserFromCourse} = this.props.actions;
    const courseId = viewPath(['courseDetails', 'course', 'id'], this.props);
    return <Menu
      open={!!anchor}
      anchorEl={anchor}
      onClose={this.closeMenu}>
      <MenuItem onClick={() => {this.closeMenu(); removeUserFromCourse(courseId, user.id);}}>
        <IconDelete/>
        <span style={{marginLeft: '8px'}}>Aus Kurs entfernen</span>
      </MenuItem>
      <MenuItem onClick={() => {this.closeMenu()}}>
        <IconUser/>
        <span style={{marginLeft: '8px'}}>Profil anzeigen (folgt)</span>
      </MenuItem>
    </Menu>
  };

  openAddUserMenu = event => {
    this.setState(setPath(['addUser'], {anchor: event.currentTarget}, this.state));
  };

  closeAddUserMenu = () => {
    this.setState(setPath(['addUser'], {anchor: null}, this.state));
  };

  getUserMenuItem = (user, idx) => {
    const attendees = viewPath(['courseDetails', 'course', 'attendees'], this.props) || [];
    const {addUserToCourse} = this.props.actions;
    const courseId = viewPath(['courseDetails', 'course', 'id'], this.props);

    for (const attendee of attendees) {
      if (attendee.id === user.id) {
        return undefined;
      }
    }

    return <MenuItem key={idx} onClick={() => {this.closeAddUserMenu(); addUserToCourse(courseId, user.id)}}>
      <Avatar>
        <ProfilePicture user={user}/>
      </Avatar>
      <span style={{marginLeft: '8px'}}>
          {user.firstname + ' ' + user.lastname}
        </span>
    </MenuItem>
  };

  getAddUserMenu = () => {
    const {anchor} = this.state.addUser;
    const {updateUsers} = this.props.actions;
    const open = !!anchor;
    if (open) {
      updateUsers();
    }
    const {pending, data} = this.props.users;
    return <Menu
      open={open}
      anchorEl={anchor}
      PaperProps={{
        style: {
          maxHeight: 48 * 4.5,
        },
      }}
      onClose={this.closeAddUserMenu}>
      {pending ? <LoadingIndicator /> : data.map(this.getUserMenuItem)}
    </Menu>
  };

  getAttendeeList = attendees => {
    const roles = viewPath(['currentUser', 'roles'], this.props) || {};
    const actionAllowed = roles['TRAINER'] || roles['ADMIN'];
    return attendees.map((user, idx) =>
      <Grid
        item xs={3} key={idx}
        style={{cursor: 'pointer'}}
        onClick={actionAllowed ? event => this.openMenu(event, user) : undefined}>
        <Avatar style={{backgroundColor: TITLE_BG, margin: '0 auto'}}>
          <ProfilePicture user={user}/>
        </Avatar>
        <Typography
          variant='caption'
          gutterBottom
          align='center'>
          {user.firstname + ' ' + user.lastname}
        </Typography>
      </Grid>
    );
  };

  getAddUserButton = () => {
    return <Grid
      item xs={3}
      style={{cursor: 'pointer'}}
      onClick={this.openAddUserMenu}
    >
      <Avatar style={{backgroundColor: '#03a9f4', margin: '0 auto'}}>
        <IconUserAdd/>
      </Avatar>
      <Typography
        variant='caption'
        gutterBottom
        align='center'>
        {'Teilnehmer hinzu'}
      </Typography>
    </Grid>
  };

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
      course = NEW_COURSE
    } = courseDetails;
    const {
      toggleEditCourse,
      onCourseDetailsChange
    } = actions;

    const {title, readonly} = mode;
    const {start, courseTypeId, minutes, attendees = [],
      instructor = {}, maxParticipants, signedIn} = course;
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
              <Grid item xs={2} sm={1} style={{margin: 'auto'}}>
                <Avatar style={{backgroundColor: color}}>
                  <span>{short}</span>
                </Avatar>
              </Grid>
              <GridItemSelectControl
                xs={10}
                sm={5}
                id='type'
                readonly={readonly}
                label='Kurstyp'
                value={courseTypeId}
                values={courseTypes.data}
                keyProp='id'
                valueProp='name'
                onChange={value => onCourseDetailsChange('courseTypeId', value)}
              />
              <Grid item xs={2} sm={1} style={{margin: 'auto'}}>
                <Avatar style={{backgroundColor: TITLE_BG}}>
                  <ProfilePicture user={instructor} />
                </Avatar>
              </Grid>
              <GridInputControl
                xs={10}
                sm={5}
                id='instructor'
                label='Kursleitung'
                readonly={true}
                value={instructor.firstname}
                onChangte={() => {}}
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
                onChange={(id, value) => onCourseDetailsChange('minutes', Number.parseInt(value))}
                endAdornment={<InputAdornment position="end">Minuten</InputAdornment>}
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
                onChange={(id, value) => onCourseDetailsChange('maxParticipants', Number.parseInt(value))}
              />
              <GridTextControl text={'Teilnehmer'}/>
              {this.getUserMenu()}
              {this.getAttendeeList(attendees)}
              {this.getAddUserButton()}
              {this.getAddUserMenu()}
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
  courseDetails: state.courses.courseDetails,
  users: state.profile.users
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    showNotification: showNotification,
    // users
    updateUsers: updateUsers,
    // courses
    fetchCourses: fetchCourses,
    hideCourseDetails: hideCourseDetails,
    saveCourseDetails: saveCourseDetails,
    toggleEditCourse: toggleEditCourse,
    onCourseDetailsChange: onCourseDetailsChange,
    signIn: signIn,
    signOut: signOut,
    addUserToCourse: addUserToCourse,
    removeUserFromCourse: removeUserFromCourse
  }, dispatch),
  dispatch
});


export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(CourseDetails);