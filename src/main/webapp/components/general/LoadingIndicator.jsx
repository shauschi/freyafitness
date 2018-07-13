'use strict';
import React, {Component} from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

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
  },
  indicatorSmall: {
    width: '16px',
    height: '16px'
  }
};

class LoadingIndicator extends Component {

  render()
  {
    const {noLabel, label = 'lädt...', small} = this.props;
    return (
      <div style={loadingStyles.table}>
        <div style={loadingStyles.cell}>
          <CircularProgress
            color='secondary'
            mode='indeterminate'
            style={small ? loadingStyles.indicatorSmall : loadingStyles.indicator}/>
          {
            noLabel
            ? undefined
            : <Typography color='primary'>{label}</Typography>
          }
        </div>
      </div>
    );
  };
}

export default LoadingIndicator;