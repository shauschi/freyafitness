'use strict';
import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid';
import {IconSignIn} from './../../utils/Icons';
import {ValidationGroup} from './../general/validation';
import {
  GridTextControl,
  GridInputControl,
  GridPasswordControl,
  GridButtonControl
} from './../general';

class LoginForm extends Component {

  validateForm = () => {
    const result = this.validationGroup.validate();
    return result.valid;
  };

  setValidation = ref => {
    this.validationGroup = ref;
  };

  doLogin = () => {
    if (this.validateForm()) {
      const {formData, login} = this.props;
      const loginData = {
        email: formData.email,
        password: formData.password
      };
      return login(loginData);
    }
  };

  render() {
    const {formData, formDataChanged, pending, error} = this.props;

    return (
      <Grid container spacing={16} justify="center" style={{width: '100%', margin: '0px'}}>
        <ValidationGroup ref={this.setValidation}>
          <GridTextControl
            text={'Du bist bereits registriert? Dann melde dich gleich an und sieh, was es neues gibt:'}/>
          <GridInputControl
            id='email'
            label='E-Mail'
            value={formData.email}
            onChange={formDataChanged}/>
          <GridPasswordControl
            id='password'
            label='Password'
            value={formData.password}
            onChange={formDataChanged}/>
          {error ? <GridTextControl text={error} error={true}/> : undefined}
          <GridButtonControl
            pending={pending}
            label='login'
            icon={<IconSignIn style={{marginLeft: '8px'}} size={16}/>}
            onClick={this.doLogin}/>
        </ValidationGroup>
      </Grid>
    );
  }
}

export default LoginForm;