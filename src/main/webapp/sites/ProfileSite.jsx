import React, {Component} from 'react';
import Profile from './../components/profile';

class ProfileSite extends Component {
  render() {
    const {profile, pending} = this.props;
    if (pending) {
      return <div>Loading...</div>
    } else {
      return (
        <div style={{padding: '16px'}}>
          <Profile profile={profile}/>
        </div>
      );
    }
  }
}

export default ProfileSite;