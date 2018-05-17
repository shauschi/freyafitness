'use strict';
import React, {Component} from 'react';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import {FormControl, FormHelperText} from 'material-ui/Form';
import Input, {InputAdornment, InputLabel} from "material-ui/Input";
import {IconEye, IconEyeSlash} from './../../utils/Icons';
import {setPath, togglePath} from './../../utils/RamdaUtils';
import ValidationControl from "./validation/ValidationControl";

const GridWrapper = ({children, xs = 12, md, style={paddingLeft: '0px', paddingRight: '0px'}}) =>
  <Grid item xs={xs} md={md}
        style={style}>
    {children}
  </Grid>;

export class GridTextControl extends Component {

  render() {
    const {text} = this.props;
    return <GridWrapper
      style={{paddingLeft: '0px', paddingRight: '0px', paddingTop: '16px', paddingBottom: '16px'}}>
      <Typography>{text}</Typography>
    </GridWrapper>;
  }
}


export const GridFormControl = ({error, children}) =>
  <GridWrapper>
    <FormControl fullWidth error={error}>
      {children}
    </FormControl>
  </GridWrapper>;

export class GridInputControl extends ValidationControl {

  render() {
    const {valid, errors} = this.state;
    const {id, label, value, type, endAdornment, onChange} = this.props;
    return <GridFormControl error={!valid}>
      <InputLabel htmlFor={id} shrink>{label}</InputLabel>
      <Input
        id={id}
        value={value}
        type={type}
        onChange={event => onChange(id, event.target.value)}
        endAdornment={endAdornment}/>
      <FormHelperText>{errors}</FormHelperText>
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
      <FormHelperText>{errors}</FormHelperText>
    </GridFormControl>;
  }
}

export class GridButtonControl extends Component {

  render() {
    const {label, icon, onClick} = this.props;
    return <GridFormControl>
      <Button
        raised
        color='primary'
        onClick={onClick}>
        {label}
        {icon}
      </Button>
    </GridFormControl>;
  }
}