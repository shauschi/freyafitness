'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import {GridPasswordControl, GridSwitchControl, GridTextControl, LoadingIndicator} from '../components/general';
import {
  changeTempProfilePicture,
  closeProfilePictureChangeDialog,
  fetchOwnProfile,
  onProfileDetailsChange,
  openProfilePictureChangeDialog,
  saveProfilePicture,
  updatePreference
} from './../model/profile';
import {changePassword, onCancelPasswordChange, onOpenPasswordChange, onPasswordChange} from './../model/password';
import {withStyles} from "@material-ui/core/styles/index";
import * as Style from "./../utils/Style";
import {IconExpandMore} from './../utils/Icons';
import {findBy} from './../utils/RamdaUtils';
import {ValidationGroup, Validators} from "../components/general/validation";

class Preferences extends Component {

  state = {
    expanded: null,
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  validateForm = () => {
    const result = this.validationGroup.validate();
    return result.valid;
  };

  setValidation = ref => {
    this.validationGroup = ref;
  };

  doChangePassword = () => {
    if (this.validateForm()) {
      const {password, actions} = this.props;
      const {changePassword} = actions;
      return changePassword(password.data);
    }
  };

  getSwitch = ({key, label, labelNotChecked = label}) => {
    const {user, actions} = this.props;
    const {updatePreference} = actions;
    const {preferences} = user;
    const preference = findBy('key', preferences, key) || {};
    const checked = preference.value === 'true' || preference.value === true;
    return (<GridSwitchControl
      value={checked}
      onChange={(id, value) => updatePreference({userId: user.id, key: key, value: value})}
      label={checked ? label : labelNotChecked}/>
    );
  }

  render() {
    const {profile} = this.props;
    if (profile.pending || !this.props.user) {
      return (<LoadingIndicator/>);
    } else {
      const {expanded} = this.state;
      const {user} = this.props;
      const {
        pending,
        error,
        data,
      } = this.props.password;
      const {
        oldPassword,
        password,
        matchingPassword
      } = data;
      const {onPasswordChange} = this.props.actions;

      return (
        <div className={this.props.classes.root}>
          <Grid container spacing={16} justify="center" style={{width: '100%', margin: '0px'}}>
            <Grid item xs={12} sm={8}>
              <ExpansionPanel expanded={expanded === 'privacy'} onChange={this.handleChange('privacy')}>
                <ExpansionPanelSummary expandIcon={<IconExpandMore/>}>
                  <div>
                    <Typography variant='subheading' paragraph>Privatsphäre</Typography>
                    <Typography>Deine Privatsphäre ist uns wichtig und du bestimmst, was andere von dir sehen dürfen.</Typography>
                  </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container spacing={16} justify="center" style={{width: '100%', margin: '0px'}}>
                    {
                      this.getSwitch({
                        key: 'VIEW_PARTICIPATION',
                        label: 'Andere Benutzer dürfen sehen, wenn du an Kursen teilnimmst'
                      })
                    }
                    {
                      this.getSwitch({
                        key: 'VIEW_PROFILE_PICTURE',
                        label: 'Andere Benutzer dürfen dein Profilbild sehen'
                      })
                    }
                    {
                      this.getSwitch({
                        key: 'VIEW_PROFILE',
                        label: 'Andere Benutzer dürfen dein Profil sehen'
                      })
                    }
                    {
                      this.getSwitch({
                        key: 'VIEW_STATISTICS',
                        label: 'Andere Benutzer dürfen deine Statistiken (PR) ansehen'
                      })
                    }
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>

              <ExpansionPanel expanded={expanded === 'notification'} onChange={this.handleChange('notification')}>
                <ExpansionPanelSummary expandIcon={<IconExpandMore/>}>
                  <div>
                    <Typography variant='subheading' paragraph>Benachrichtigungen</Typography>
                    <Typography>Gerne halten wird dich per Mail auf dem Laufenden.</Typography>
                  </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container spacing={16} justify="center" style={{width: '100%', margin: '0px'}}>
                    {
                      this.getSwitch({
                        key: 'NOTIFICATION_NEW_COURSES',
                        label: 'Wir informieren dich wöchentlich über neue Kurse'
                      })
                    }
                    {
                      this.getSwitch({
                        key: 'NOTIFICATION_CANCELLATION',
                        label: 'Wir informieren dich, wenn ein Kurs abgesagt wird, dem du zugesagt hast'
                      })
                    }
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>

              <ExpansionPanel expanded={expanded === 'password'} onChange={this.handleChange('password')}>
                <ExpansionPanelSummary expandIcon={<IconExpandMore/>}>
                  <div>
                    <Typography variant='subheading' paragraph>Password</Typography>
                    <Typography>Hier kannst du dein Password zurücksetzen.</Typography>
                  </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container spacing={16} justify="center" style={{width: '100%', margin: '0px'}}>
                    <ValidationGroup ref={this.setValidation}>
                      <GridTextControl
                        text={'Dein neues Password muss mindestens 8 Zeichen lang sein und sollte regelmäßig von dir geändert werden.'}/>
                      <GridPasswordControl
                        id='oldPassword'
                        label='Aktuelles Password'
                        value={oldPassword}
                        onChange={(id, value) => onPasswordChange(['oldPassword'], value)}/>
                      <GridPasswordControl
                        id='password'
                        label='Neues Password'
                        value={password}
                        validators={[Validators.minLength(8)]}
                        onChange={(id, value) => onPasswordChange(['password'], value)}/>
                      <GridPasswordControl
                        id='matchingPassword'
                        label='Password bestätigen'
                        value={matchingPassword}
                        validators={[Validators.matches(password, 'Das neue Password stimmt nicht überein.')]}
                        onChange={(id, value) => onPasswordChange(['matchingPassword'], value)}/>
                    </ValidationGroup>
                    {error}
                  </Grid>
                </ExpansionPanelDetails>
                <ExpansionPanelActions>
                  <Button onClick={this.doChangePassword} color='primary' disabled={pending}>
                    {'Speichern'}
                    {
                      pending
                        ? <div style={{position: 'absolute'}}>
                          <LoadingIndicator noLabel small/>
                        </div>
                        : undefined
                    }
                  </Button>
                </ExpansionPanelActions>
              </ExpansionPanel>
            </Grid>

          </Grid>
        </div>
      );
    }
  }
}

const mapStateToProps = state => ({
  profile: state.profile,
  user: state.profile.user,
  password: state.password
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    // profile
    fetchOwnProfile: fetchOwnProfile,
    onProfileDetailsChange: onProfileDetailsChange,
    openProfilePictureChangeDialog: openProfilePictureChangeDialog,
    closeProfilePictureChangeDialog: closeProfilePictureChangeDialog,
    saveProfilePicture: saveProfilePicture,
    changeTempProfilePicture: changeTempProfilePicture,
    updatePreference: updatePreference,

    // password
    onPasswordChange: onPasswordChange,
    onOpenPasswordChange: onOpenPasswordChange,
    onCancelPasswordChange: onCancelPasswordChange,
    changePassword: changePassword
  }, dispatch),
  dispatch
});

export default compose(
  withStyles(Style.APP_STYLES, {withTheme: true}),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Preferences);