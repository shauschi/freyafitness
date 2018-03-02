'use strict';
import React from 'react';
import {IconUser} from '../../utils/Icons';

const ProfilePicture = ({userId}) => {
  if (userId) {
    return (
      <div style={{height: '100%'}}>
        <img
          src={'http://127.0.0.1:9000/profile/' + userId + '/picture'}
          style={{width: '100%'}}/>
      </div>
    );
  } else {
    return (
      <IconUser/>
    );
  }
};

export default ProfilePicture;