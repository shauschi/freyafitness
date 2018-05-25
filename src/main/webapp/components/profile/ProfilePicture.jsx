'use strict';
import React, {Component} from 'react';
import {IconUser} from '../../utils/Icons';
import {LoadingIndicator} from "../general";
import {assignPath} from '../../utils/RamdaUtils';
import {getProfilePicture} from '../../service/profile';

class ProfilePicture extends Component {

  constructor(props) {
    super(props);
    this.state = {loading: false, picture: undefined}
  }

  updatePicture() {
    const {userId} = this.props;
    if (this.state.userId !== userId) {
      this.setState(assignPath([], {loading: true, userId: userId}, this.state));
      getProfilePicture(userId)
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
    const {userId} = this.props;
    if (userId) {
      this.updatePicture();
    }
    const {loading, picture} = this.state;
    if (loading) {
      return <LoadingIndicator noLabel style={{marginTop: '4px'}}/>;
    }
    if (!picture) {
      // TODO alternative: e.g. user initials
      return <IconUser/>;
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