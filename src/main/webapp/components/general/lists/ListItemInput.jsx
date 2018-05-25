'use strict';
import React from 'react';
import Row from './Row.jsx';
import Input from '@material-ui/core/Input';

class ListItemInput extends Row {

  getCtrl() {
    const {
      id,
      type,
      value,
      endAdornment,
      onChange,
      readonly,
    } = this.props;

    return (
      <Input id={id} type={type}
             endAdornment={endAdornment}
             value={value}
             onChange={event => onChange(event.target.value)}
             disabled={readonly}/>
    );
  }
}

export default ListItemInput;