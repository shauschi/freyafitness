import React, {Component} from 'react';
import Grid from 'material-ui/Grid';
import Profile from './../components/profile';

class ProfileSite extends Component {
  render() {
    const {profile, pending, onProfileDetailsChange} = this.props;
    if (pending) {
      return <div>Loading...</div>
    } else {
      return (
        <Grid container spacing={16} justify="center" style={{width: '100%', margin: '0px'}}>
          <Grid item xs={12} md={12} style={{padding: '0px'}}>
            <Profile profile={profile} onProfileDetailsChange={onProfileDetailsChange}/>
          </Grid>
        </Grid>
      );
    }
  }
}

export default ProfileSite;