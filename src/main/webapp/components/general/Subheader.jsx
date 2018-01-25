'use strict';
import React from 'react';
import {ListSubheader} from 'material-ui/List';
import {blueGrey} from "material-ui/colors/index";

const Subheader = ({label}) => (
  <ListSubheader style={{background: blueGrey.A400, color: 'white', lineHeight: '32px'}}>
    {label}
  </ListSubheader>
);

export default Subheader
