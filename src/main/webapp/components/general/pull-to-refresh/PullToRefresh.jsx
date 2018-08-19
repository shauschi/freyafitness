'use strict';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactPullToRefresh from 'rmc-pull-to-refresh';
import JsPullToRefresh from 'pulltorefreshjs';
import Typography from '@material-ui/core/Typography';
import {LoadingIndicator} from './../';
import moment from 'moment';
import './styles.css'

class PullToRefresh extends Component {

  state = {
    updating: undefined
  };

  static contextTypes = {
    onRefresh: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
  };

  onRefresh = cb => {
    cb();
    this.props.onRefresh();
    this.setState({updating: true});
    setTimeout(() => this.setState({updating: false}), 500);
  };

  componentDidMount() {
    JsPullToRefresh.init({
      mainElement: '#pull-to-refresh',
      triggerElement: '#pull-to-refresh',
      refreshTimeout: 0,
      instructionsPullToRefresh: 'zum Aktualisieren herunterziehen',
      instructionsReleaseToRefresh: 'jetzt loslassen',
      onRefresh: this.onRefresh
    });
  }

  render() {
    const {pending, style} = this.props;
    const {updating} = this.state;
    let loading = undefined;
    if (pending || updating) {
      loading = <LoadingIndicator noLabel style={{marginTop: '8px'}}/>;
    }
    return (
      <div style={style} id='pull-to-refresh'>
        {loading}
        {this.props.children}
      </div>
    )
  }
}

export default PullToRefresh;