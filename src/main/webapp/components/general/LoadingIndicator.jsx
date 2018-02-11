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
    width: '65px',
    height: '65px'
  }
};

class LoadingIndicator extends Component {

  render()
  {
    return (
      <div style={loadingStyles.table}>
        <div style={loadingStyles.cell}>
          <CircularProgress style={loadingStyles.indicator}/>
          <Typography type={'title'} color={'primary'}>loading</Typography>
        </div>
      </div>
    );
  };
}

export default LoadingIndicator;