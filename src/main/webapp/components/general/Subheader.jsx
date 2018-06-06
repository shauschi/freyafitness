'use strict';
import React from 'react';
import ListSubheader from '@material-ui/core/ListSubheader';
import blueGrey from '@material-ui/core/colors/blueGrey';

const Subheader = ({label}) => (
  <ListSubheader style={{background: blueGrey[600], color: 'white', lineHeight: '32px'}}>
    {label}
  </ListSubheader>
);

export default Subheader
