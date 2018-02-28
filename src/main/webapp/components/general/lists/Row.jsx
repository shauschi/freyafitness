'use strict';
import React, {Component} from 'react';
import {ListItem, ListItemIcon} from 'material-ui/List';
import FormControl from "material-ui/Form/FormControl";
import Input, {InputLabel} from "material-ui/Input";
import Avatar from "material-ui/Avatar";

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