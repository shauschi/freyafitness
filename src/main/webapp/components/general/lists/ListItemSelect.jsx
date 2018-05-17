'use strict';
import React from 'react';
import Row from './Row.jsx';
import Select from "material-ui/Select";
import Input from "material-ui/Input";
import {MenuItem} from "material-ui/Menu";
import {view} from './../../../utils/RamdaUtils';

class ListItemSelect extends Row {

  getCtrl() {
    const {
      id,
      value = ''  ,
      values,
      keyProp = 'key',
      valueProp = 'value',
      onChange,
      readonly,
    } = this.props;

    return (
      <Select
        value={value}
        onChange={event => onChange(event.target.value)}
        input={<Input id={id}/>}
        disabled={readonly}>
        {values.map((v, idx) =>
          <MenuItem key={idx} value={view(keyProp, v)}>
            {view(valueProp, v)}
          </MenuItem>
        )}
      </Select>
    );
  }
}

export default ListItemSelect;