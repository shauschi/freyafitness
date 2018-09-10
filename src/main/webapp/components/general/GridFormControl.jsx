'use strict';
import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import {IconEye, IconEyeSlash} from './../../utils/Icons';
import {setPath, togglePath} from './../../utils/RamdaUtils';
import {ValidationControl} from './validation';
import {DatePicker, DateTimePicker} from 'material-ui-pickers';
import * as Format from './../../utils/Format';
import {view} from '../../utils/RamdaUtils';
import {LoadingIndicator} from '../general';

import red from '@material-ui/core/colors/red';

const GridWrapper = ({children, xs = 12, sm, md, style}) =>
  <Grid item xs={xs} sm={sm} md={md}
        style={style}>
    {children}
  </Grid>;

export class GridTextControl extends Component {

  render() {
    const {text, error = false, xs, sm, md} = this.props;
    return <GridWrapper
      xs={xs} sm={sm} md={md}
      style={{paddingLeft: '0px', paddingRight: '0px', paddingTop: '16px', paddingBottom: '16px'}}>
      <Typography style={{color: error ? red.A200 : undefined}}>
        {text}
        </Typography>
    </GridWrapper>;
  }
}

const GridFormControl = ({error, children, style, xs, sm, md}) =>
  <GridWrapper style={style} xs={xs} sm={sm} md={md}>
    <FormControl fullWidth error={error} margin='dense'>
      {children}
    </FormControl>
  </GridWrapper>;

export class GridInputControl extends ValidationControl {

  render() {
    const {valid, errors} = this.state;
    const {id, label, value, readonly,
      multiline, disableUnderline,
      type, endAdornment, onChange, xs, sm, md} = this.props;
    return <GridFormControl error={!valid} xs={xs} sm={sm} md={md}>
      <InputLabel htmlFor={id} shrink>{label}</InputLabel>
      <Input
        id={id}
        value={value}
        type={type}
        multiline={multiline}
        disableUnderline={disableUnderline}
        rows={multiline ? 5 : undefined}
        readOnly={readonly}
        onChange={event => onChange(id, event.target.value)}
        endAdornment={endAdornment}/>
      {!valid ? <FormHelperText>{errors}</FormHelperText> : undefined}
    </GridFormControl>;
  }
}

export class GridCheckboxControl extends ValidationControl {

  render() {
    const {valid, errors} = this.state;
    const {id, value, onChange, label, xs, sm, md} = this.props;
    return <GridFormControl error={!valid} xs={xs} sm={sm} md={md}>
      <FormControlLabel
        control={
          <Checkbox
            id={id}
            checked={value} // has to be value, because of ValidationControl
            onChange={event => onChange(id, event.target.checked)}
          />
        }
        label={label}
      />
      {!valid ? <FormHelperText>{errors}</FormHelperText> : undefined}
    </GridFormControl>;
  }
}

export class GridSwitchControl extends ValidationControl {

  render() {
    const {valid, errors} = this.state;
    const {id, value, onChange, label, xs, sm, md} = this.props;
    return <GridFormControl error={!valid} xs={xs} sm={sm} md={md}>
      <FormControlLabel
        control={
          <Switch
            id={id}
            checked={value} // has to be value, because of ValidationControl
            onChange={event => onChange(id, event.target.checked)}
          />
        }
        label={label}
      />
      {!valid ? <FormHelperText>{errors}</FormHelperText> : undefined}
    </GridFormControl>;
  }
}

export class GridPasswordControl extends ValidationControl {

  constructor(props) {
    super(props);
    this.state = setPath(['showPassword'], false, this.state);
  }

  toggleShowPassword = () => {
    this.setState(togglePath(['showPassword'], this.state));
  };

  render() {
    const {showPassword, valid, errors} = this.state;
    const {id, label, value, onChange} = this.props;
    return <GridFormControl error={!valid}>
      <InputLabel htmlFor={id} shrink>{label}</InputLabel>
      <Input
        id={id}
        value={value}
        type={showPassword ? 'text' : 'password'}
        onChange={event => onChange(id, event.target.value)}
        endAdornment={
          <InputAdornment position='end'>
            <IconButton onClick={this.toggleShowPassword}>
              {showPassword ? <IconEyeSlash/> : <IconEye/>}
            </IconButton>
          </InputAdornment>
      }/>
      {!valid ? <FormHelperText>{errors}</FormHelperText> : undefined}
    </GridFormControl>;
  }
}

export class GridItemSelectControl extends ValidationControl {

  getValue = v => {
    const {valueProp = 'value'} = this.props;
    if (typeof valueProp === 'function') {
      return valueProp(v)
    }
    return view(valueProp, v);
  }

  render() {
    const {valid, errors} = this.state;
    const {
      id,
      value = '',
      values,
      keyProp = 'key',
      valueProp = 'value',
      label,
      onChange,
      readonly,
      xs,
      sm,
      md
    } = this.props;
    return <GridFormControl xs={xs} sm={sm} md={md} error={!valid}>
      <InputLabel htmlFor={id} shrink>{label}</InputLabel>
      <Select
        value={value}
        onChange={event => onChange(event.target.value)}
        input={<Input id={id}/>}
        disabled={readonly}>
        {values.map((v, idx) =>
          <MenuItem key={idx} value={view(keyProp, v)}>
            {this.getValue(v)}
          </MenuItem>
        )}
      </Select>
      {!valid ? <FormHelperText>{errors}</FormHelperText> : undefined}
    </GridFormControl>
  }

}

export class GridDateControl extends ValidationControl {

  render() {
    const {valid, errors} = this.state;
    const {value, label, readonly, onChange, clearable, xs, md} = this.props;
    return <GridFormControl xs={xs} md={md} error={!valid}>
      <DatePicker
        value={value}
        onChange={onChange}
        label={label}
        format={Format.DATE_FORMAT_WITH_DAY}
        okLabel={'OK'}
        cancelLabel={'ABBRECHEN'}
        todayLabel={'HEUTE'}
        clearLabel={'LÖSCHEN'}
        showTodayButton={!clearable}
        allowKeyboardControl={false}
        disableOpenOnEnter={true}
        clearable={clearable}
        InputProps={{disabled: readonly, style: {marginTop: '13px'}}}
      />
      {!valid ? <FormHelperText>{errors}</FormHelperText> : undefined}
    </GridFormControl>;
  }
}

export class GridDateTimeControl extends ValidationControl {

  render() {
    const {valid, errors} = this.state;
    const {value, label, readonly, onChange, ctrlRef, style, xs, md} = this.props;
    return <GridFormControl xs={xs} md={md} error={!valid} style={style}>
      <DateTimePicker
        ref={ctrlRef}
        value={value}
        onChange={onChange}
        label={label}
        ampm={false}
        format={Format.TIMESTAMP_FORMAT_DE}
        okLabel={'OK'}
        cancelLabel={'ABBRECHEN'}
        todayLabel={'HEUTE'}
        showTodayButton
        disableOpenOnEnter={readonly}
        InputProps={{disabled: readonly, style: {marginTop: '13px'}}}
      />
      {!valid ? <FormHelperText>{errors}</FormHelperText> : undefined}
    </GridFormControl>;
  }
}

export class GridButtonControl extends Component {

  render() {
    const {
      variant = 'raised',
      size = 'medium',
      color = 'primary',
      label,
      icon,
      onClick,
      pending
    } = this.props;
    return <GridFormControl>
      <Button
        variant={variant}
        size={size}
        color={color}
        disabled={pending}
        onClick={onClick}>
        {label}
        {icon}
      </Button>
      {
        pending
          ? <div style={{position: 'absolute', width: '100%', height: '100%'}}>
            <LoadingIndicator noLabel small/>
          </div>
          : undefined
      }
    </GridFormControl>;
  }
}