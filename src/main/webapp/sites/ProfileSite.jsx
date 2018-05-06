'use strict';
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Grid from 'material-ui/Grid';
import Profile, {ProfilePictureDialog} from './../components/profile';
import {ChangePasswordDialog} from '../components/account';
import {LoadingIndicator} from "../components/general";
import {
  fetchOwnProfile,
  changeTempProfilePicture,
  openProfilePictureChangeDialog,
  closeProfilePictureChangeDialog,
  saveProfilePicture,
  onProfileDetailsChange
} from "./../model/profile";
import {
  onPasswordChange,
  onOpenPasswordChange,
  onCancelPasswordChange,
  changePassword
} from "./../model/password";

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
            password={password}
            onClose={actions.onCancelPasswordChange}
            onPasswordChange={actions.onPasswordChange}
            onSave={actions.changePassword}
          />
          <Grid item xs={12} md={12} style={{padding: '0px'}}>
            <Profile
              profile={profile}
              onProfileDetailsChange={actions.onProfileDetailsChange}
              onOpenPasswordChange={actions.onOpenPasswordChange}
              onOpenProfilPictureChange={actions.openProfilePictureChangeDialog}
            />
          </Grid>
        </Grid>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSite);