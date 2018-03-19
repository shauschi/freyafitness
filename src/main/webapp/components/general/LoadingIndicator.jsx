'use strict';
import React, {Component} from 'react';
import {CircularProgress} from 'material-ui/Progress';
import Typography from 'material-ui/Typography';

const loadingStyles = {
  table: {
    height: '100%',
    width: '100%',
    textAlign: 'center',
    display: 'table'
  },
  cell: {
    display: 'table-cell',
    verticalAlign: 'middle'
  },
  indicator: {
    width: '32px',
    height: '32px'
  }
};

class LoadingIndicator extends Component {

  render()
  {
    return (
      <div style={loadingStyles.table}>
        <div style={loadingStyles.cell}>
          <CircularProgress mode='indeterminate' style={loadingStyles.indicator}/>
          <Typography color='primary'>loading</Typography>
        </div>
      </div>
    );
  };
}

export default LoadingIndicator;