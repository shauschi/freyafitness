'use strict';
import React from 'react';
import {FaUser} from 'react-icons/lib/fa';

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
      <FaUser/>
    );
  }
};

export default ProfilePicture;