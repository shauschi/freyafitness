import React, {Component} from 'react';
import Grid from 'material-ui/Grid';
import Profile from './../components/profile';
import {ChangePasswordDialog} from './../components/password';

class ProfileSite extends Component {
  render() {
    const {
      profile,
      pending,
      onProfileDetailsChange,
      password,
      onPasswordChange,
      onOpenPasswordChange,
      onCancelPasswordChange,
      changePassword
    } = this.props;

    if (pending) {
      return <div>Loading...</div>
    } else {
      return (
        <Grid container spacing={16} justify="center" style={{width: '100%', margin: '0px'}}>
          <Grid item xs={12} md={12} style={{padding: '0px'}}>
            <Profile profile={profile} onProfileDetailsChange={onProfileDetailsChange}
                     onOpenPasswordChange={onOpenPasswordChange}/>
          </Grid>
          <ChangePasswordDialog password={password}
                                onClose={onCancelPasswordChange}
                                onPasswordChange={onPasswordChange}
                                onSave={changePassword}
                                />
        </Grid>
      );
    }
  }
}

export default ProfileSite;