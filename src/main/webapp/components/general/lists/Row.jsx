'use strict';
import React, {Component} from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Avatar from '@material-ui/core/Avatar';

import {TITLE_BG} from '../../../utils/Style/index'

class Row extends Component {

  constructor(props) {
    super(props);
    this.getCtrl = this.getCtrl.bind(this);
  }

  getCtrl() {
    throw new Error('must be implemented in child');
  }

  render()
  {
    const {
      icon,
      id,
      label,
      inset,
      iconBackground = TITLE_BG,
      backgroundColor = 'rgba(255, 255, 255, 0.75)'
    } = this.props;

    return (
      <ListItem style={{backgroundColor: backgroundColor}} inset={inset}>
        {icon
          ? <ListItemIcon>
              <Avatar style={{backgroundColor: iconBackground}}>
                {icon}
              </Avatar>
            </ListItemIcon>
          : undefined
        }
        <FormControl fullWidth>
          <InputLabel htmlFor={id} shrink>{label}</InputLabel>
          {this.getCtrl()}
        </FormControl>
      </ListItem>
    );
  };
}

export default Row;