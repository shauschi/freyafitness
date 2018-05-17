'use strict';
import React from 'react';
import {ListItem, ListItemIcon, ListItemText} from 'material-ui/List';
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