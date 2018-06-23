'use strict';
import React, {Component} from 'react';
import {IconUser} from '../../utils/Icons';
import {LoadingIndicator} from '../general';
import {assignPath} from '../../utils/RamdaUtils';
import {getProfilePicture} from '../../service/profile';

class ProfilePicture extends Component {

  constructor(props) {
    super(props);
    this.state = {loading: false, picture: undefined}
  }

  updatePicture() {
    const {user = {}} = this.props;
    const {id} = user;
    if (this.state.userId !== id) {
      this.setState(assignPath([], {loading: true, userId: id}, this.state));
      getProfilePicture(id)
        .then(pictureData => {
          const objectURL = URL.createObjectURL(pictureData);
          this.setState(assignPath([],
            {picture: objectURL, loading: false}, this.state));
        })
        .catch(() => {
          this.setState(assignPath([], {loading: false}, this.state));
        });
    }
  }

  render() {
    const {user} = this.props;
    if (user) {
      this.updatePicture();
    }
    const {loading, picture} = this.state;
    if (loading) {
      return <LoadingIndicator noLabel style={{marginTop: '4px'}}/>;
    }
    if (!picture) {
      if (user && user.firstname && user.lastname) {
        return <span>{user.firstname.charAt(0) + user.lastname.charAt(0)}</span>;
      } else {
        return <IconUser/>;
      }
    }
    return (
      <div style={{height: '100%'}}>
        <img
          src={picture}
          style={{width: '100%'}}/>
      </div>
    );
  }
}

export default ProfilePicture;