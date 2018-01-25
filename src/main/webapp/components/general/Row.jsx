'use strict';
import React, {Component} from 'react';
import {ListItem, ListItemIcon} from 'material-ui/List';
import FormControl from "material-ui/Form/FormControl";
import Input, {InputLabel} from "material-ui/Input";

class Row extends Component {
  render()
  {
    const {
      icon,
      id,
      label,
      type,
      value,
      endAdornment,
      onChange,
      inset,
      readonly,
      backgroundColor = 'rgba(255, 255, 255, 0.75)'
    } = this.props;

    return (
      <ListItem style={{backgroundColor: backgroundColor}} inset={inset}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : undefined}
        <FormControl fullWidth>
          <InputLabel htmlFor={id}>{label}</InputLabel>
          <Input id={id} type={type}
                 endAdornment={endAdornment}
                 value={value}
                 onChange={event => onChange(event.target.value)}
                 disabled={readonly}/>
        </FormControl>
      </ListItem>
    );
  };
}

export default Row;