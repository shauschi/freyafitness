'use strict';
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {Link} from 'react-router-dom';

const MenuLink = ({to, label, icon, onClick}) => (
  <Link to={to} style={{textDecoration: 'none'}} onClick={onClick}>
    <ListItem button>
      <ListItemIcon>
        {icon}
      </ListItemIcon>
      <ListItemText primary={label}/>
    </ListItem>
  </Link>
);

export default MenuLink;