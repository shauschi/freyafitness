'use strict';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactPullToRefresh from 'rmc-pull-to-refresh';
import Typography from '@material-ui/core/Typography';
import {LoadingIndicator} from './../';

class PullToRefresh extends Component {

  static contextTypes = {
    onRefresh: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
  };

  onRefresh = () => {
    this.props.onRefresh();
    return new Promise(resolve => resolve());
  };

  render() {
    const {pending, style} = this.props;
    return (
      <div style={{marginTop: '-16px', ...style}}>
        <ReactPullToRefresh
          style={{ height: 'calc(100vh - 96px)', overflow: 'auto' }}
          indicator={{
            deactivate:
              <Typography variant='caption' style={{textAlign: 'center'}}>
                zum Aktualisieren herunterziehen
              </Typography>,
            activate:
              <Typography variant='caption' style={{textAlign: 'center'}}>
                jetzt loslassen
              </Typography>,
            release: <LoadingIndicator noLabel/>,
            finish: 'done'
          }}
          distanceToRefresh={48}
          refreshing={pending}
          onRefresh={this.onRefresh}
        >
          {this.props.children}
        </ReactPullToRefresh>
      </div>
    )
  }
}

export default PullToRefresh;