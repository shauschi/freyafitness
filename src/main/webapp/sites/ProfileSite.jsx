'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Profile, {ProfilePictureDialog} from './../components/profile';
import {ChangePasswordDialog} from '../components/account';
import {LoadingIndicator} from '../components/general';
import {
  changeTempProfilePicture,
  closeProfilePictureChangeDialog,
  fetchOwnProfile,
  onProfileDetailsChange,
  openProfilePictureChangeDialog,
  saveProfilePicture
} from './../model/profile';
import {changePassword, onCancelPasswordChange, onOpenPasswordChange, onPasswordChange} from './../model/password';
import {withStyles} from "@material-ui/core/styles/index";
import * as Style from "../utils/Style";

class ProfileSite extends Component {
  render() {
    const {
      profile,
      password,
      actions
    } = this.props;

    if (profile.pending) {
      return (<LoadingIndicator/>);
    } else {
      return (
        <div className={this.props.classes.root}>
          <Grid container spacing={16} justify="center" style={{width: '100%', margin: '0px'}}>
            <ProfilePictureDialog
              show={profile.picture.dialog.open}
              temp={profile.picture.temp}
              pending={profile.picture.pending}
              errorMessage={profile.picture.errorMessage}
              changeTempProfilePicture={actions.changeTempProfilePicture}
              onSave={actions.saveProfilePicture}
              onClose={actions.closeProfilePictureChangeDialog}
            />
            <ChangePasswordDialog
              formData={password}
              pending={password.pending}
              open={password.open}
              errorMessage={password.errorMessage}
              onClose={actions.onCancelPasswordChange}
              onPasswordChange={actions.onPasswordChange}
              onSave={actions.changePassword}
            />
            <Grid item xs={12} md={8} style={{padding: '0px'}}>
              <Profile
                profile={profile}
                onProfileDetailsChange={actions.onProfileDetailsChange}
                onOpenPasswordChange={actions.onOpenPasswordChange}
                onOpenProfilPictureChange={actions.openProfilePictureChangeDialog}
              />
            </Grid>
          </Grid>
        </div>
      );
    }
  }
}

const mapStateToProps = state => ({
  profile: state.profile,
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
)(ProfileSite);