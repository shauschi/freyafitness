'use strict';
import React from 'react';
import {FaUser} from 'react-icons/lib/fa';

const ProfilePicture = ({userId, size = 60}) => {
  if (userId) {
    return (
      <div style={{width: size + 'px', height: size + 'px'}}>
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