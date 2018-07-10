'use strict';
import React from 'react';
import ListSubheader from '@material-ui/core/ListSubheader';
import blueGrey from '@material-ui/core/colors/blueGrey';

const Subheader = ({label}) => (
  <ListSubheader>
    {label}
  </ListSubheader>
);

export default Subheader
