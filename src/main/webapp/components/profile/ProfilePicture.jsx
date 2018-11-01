'use strict';
import React, {Component} from 'react';
import {IconUser} from '../../utils/Icons';
import {LoadingIndicator} from '../general';
import {assignPath} from '../../utils/RamdaUtils';
import {getProfilePicture} from '../../service/profile';
import Typography from '@material-ui/core/Typography';

const profileStyles = {
  table: {
    position: 'relative',
    height: '100%',
    width: '100%',
    textAlign: 'center',
    display: 'table'
  },
  cell: {
    display: 'table-cell',
    verticalAlign: 'middle'
  }
};

class ProfilePicture extends Component {

  constructor(props) {
    super(props);
    this.state = {loading: false, userId: null, picture: null}
  }

  updatePicture() {
    const {user = {}, size = 'MINI'} = this.props;
    const {id} = user;
    if (this.state.userId === id) {
      return;
    }

    // if next id is falsely AND current user id in state is truly
    if (!id && !!this.state.userId) {
      this.setState(assignPath([], {picture: null, userId: null, loading: false}, this.state));
    } else if (!!id) {
      this.setState(assignPath([], {picture: null, userId: id, loading: true}, this.state));
      getProfilePicture(id, size)
        .then(pictureData => {
          const objectURL = URL.createObjectURL(pictureData);
          this.setState(assignPath([],
            {picture: objectURL, loading: false}, this.state));
        })
        .catch(() => {
          this.setState(assignPath([], {picture: null, loading: false}, this.state));
        });
    }
  }

  getIcon = () => {
    const {size, asAvatar} = this.props;
    const {loading, picture} = this.state;
    if (picture) {
      return <img
        src={picture}
        style={{width: '100%', borderRadius: asAvatar ? '50%' : undefined}}/>
    } else {
      const {user} = this.props;
      if (user && user.firstname && user.lastname && !loading) {
        return <Typography>{user.firstname.charAt(0) + user.lastname.charAt(0)}</Typography>;
      } else {
        return <IconUser size={size === 'LG' ? 100 : undefined}/>;
      }
    }
  };

  render() {
    const {size = 'MINI'} = this.props;
    const {loading} = this.state;
    this.updatePicture();
    const stylesMiniLoading = size === 'MINI' ? {paddingTop: '3px'} : undefined;
    return (
      <div style={{position: 'relative', width: '100%', height: '100%'}}>
        <div style={profileStyles.table}>
          <div style={profileStyles.cell}>
            {this.getIcon()}
          </div>
        </div>
        {
          loading
            ? <div style={{
                position: 'absolute',
                left: '0px',
                top: '0px',
                width: '100%',
                height: '100%',
                ...stylesMiniLoading
            }}>
              <LoadingIndicator noLabel/>
            </div>
            : undefined
        }
      </div>
    );
  }
}

export default ProfilePicture;