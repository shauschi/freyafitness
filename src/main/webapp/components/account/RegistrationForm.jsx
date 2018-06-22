'use strict';
import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {Link} from 'react-router-dom';
import {IconPaperPlane} from './../../utils/Icons';
import {ValidationGroup, Validators} from './../general/validation';
import {
  GridTextControl,
  GridInputControl,
  GridPasswordControl,
  GridButtonControl,
  GridCheckboxControl
} from './../general';

class RegistrationForm extends Component {

  validateForm = () => {
    const result = this.validationGroup.validate();
    return result.valid;
  };

  setValidation = ref => {
    this.validationGroup = ref;
  };

  doCreateAccount = () => {
    if (this.validateForm()) {
      const {formData, createAccount} = this.props;
      const createData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
        matchingPassword: formData.matchingPassword
      };
      return createAccount(createData);
    }
  };

  render() {
    const {formData, formDataChanged} = this.props;

    return (
      <Grid container spacing={16} justify="center" style={{width: '100%', margin: '0px'}}>
        <ValidationGroup ref={this.setValidation}>
          <GridTextControl
            text={'Du hast noch kein Konto und möchtest dich gerne zu den Sportkursen online anmelden?' +
            ' Dann erstelle hier ganz einfach deinen eigenen Account.'}/>
          <GridInputControl
            id='firstname'
            label='Vorname'
            value={formData.firstname}
            validators={[Validators.notEmpty('Bitte gib deinen Vornamen an.')]}
            onChange={formDataChanged}/>
          <GridInputControl
            id='lastname'
            label='Nachname'
            value={formData.lastname}
            validators={[Validators.notEmpty('Bitte gib deinen Nachnamen an.')]}
            onChange={formDataChanged}/>
          <GridInputControl
            id='email'
            label='E-Mail'
            value={formData.email}
            validators={[Validators.email()]}
            onChange={formDataChanged}/>
          <GridPasswordControl
            id='password'
            label='Password'
            value={formData.password}
            validators={[Validators.minLength(8)]}
            onChange={formDataChanged}/>
          <GridPasswordControl
            id='matchingPassword'
            label='Password wiederholen'
            value={formData.matchingPassword}
            validators={[Validators.matches(formData.password, 'Das neue Password stimmt nicht überein.')]}
            onChange={formDataChanged}/>
          <Grid item xs={12}>
            <Typography>
              Hiermit bestätige ich, dass ich die <Link to={'/agb'}>Allgemeinen Geschäftsbedingungen</Link> gelesen habe und sie akzeptiere.
            </Typography>
          </Grid>
          <GridCheckboxControl
            id='acceptAgb'
            checked={formData.acceptAgb}
            validators={[Validators.cheked('Bitte die AGBs akzeptieren')]}
            onChange={formDataChanged}
            label='ich stimme zu'
          />
          <GridButtonControl
            label='Konto erstellen'
            icon={<IconPaperPlane style={{marginLeft: '8px'}} size={16}/>}
            onClick={this.doCreateAccount}/>
        </ValidationGroup>
      </Grid>
    );
  }
}

export default RegistrationForm;