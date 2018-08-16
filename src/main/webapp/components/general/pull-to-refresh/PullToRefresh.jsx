'use strict';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactPullToRefresh from 'react-pull-to-refresh';
import Typography from '@material-ui/core/Typography';
import './style.css';
import {LoadingIndicator} from './../';

class PullToRefresh extends Component {

  static contextTypes = {
    onRefresh: PropTypes.func.isRequired
  };

  render() {
    const {onRefresh, style} = this.props;
    return (
      <ReactPullToRefresh
        id='test'
        style={{position: 'relative', ...style}}
        icon={<div className='refresh-hint'>
          <div className='step-1'>
            <Typography variant='caption'>zum Aktualisieren ziehen...</Typography>
          </div>
          <div className='step-2'>
            <Typography variant='caption'>...jetzt loslassen</Typography>
          </div>
        </div>}
        loading={
          <div className='loading'>
            <LoadingIndicator noLabel/>
          </div>
        }
        onRefresh={onRefresh}>
        {this.props.children}
      </ReactPullToRefresh>
    )
  }
}

export default PullToRefresh;