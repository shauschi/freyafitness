'use strict';
import React, {Component} from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {ValidationGroup, Validators} from './../general/validation';
import {GridPasswordControl, GridTextControl} from './../general';
import {Dialog, LoadingIndicator} from '../general';

class PasswordForgottenDialog extends Component {

  validateForm = () => {
    const result = this.validationGroup.validate();
    return result.valid;
  };

  setValidation = ref => {
    this.validationGroup = ref;
  };

  doPasswordReset = () => {
    if (this.validateForm()) {
      const {formData, onSave} = this.props;
      const newPasswordData = {
        password: formData.password,
        token: RESET_PASSWORD_TOKEN
      };
      return onSave(newPasswordData);
    }
  };

  getContent = () => {
    const {formData, formDataChanged, errorMessage} = this.props;
    if (errorMessage) {
      return <GridTextControl
        error
        text={errorMessage}
      />;
    } else {
      return <ValidationGroup ref={this.setValidation}>
        <GridTextControl
          text={'Bitte trage hier dein neues Passwort ein. Danach kannst du dich dann direkt mit deinem neuen Passwort anmelden.'}/>
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
      </ValidationGroup>;
    }
  };

  getActions = () => {
    const {onClose, pending, errorMessage} = this.props;
    if (errorMessage) {
      return <DialogActions>
        <Button onClick={onClose} color='primary' disabled={pending}>
          {'Ok'}
        </Button>
      </DialogActions>;
    } else {
      return <DialogActions>
        <Button onClick={this.doPasswordReset} color='primary' disabled={pending}>
          {'ändern'}
          {
            pending
              ? <div style={{position: 'absolute'}}>
                <LoadingIndicator noLabel small/>
              </div>
              : undefined
          }
        </Button>

        <Button onClick={onClose} disabled={pending}>
          {'Abbrechen'}
        </Button>
      </DialogActions>;
    }
  };

  render() {
    const {open, onClose, error} = this.props;

    return (
      <Dialog
        title='Passwort zurücksetzen'
        onClose={onClose}
        fullScreen={false}
        open={open}>

        <DialogContent>
          <Grid container spacing={16} justify='center' style={{width: '100%', margin: '0px'}}>
            {this.getContent()}
            {error ? <GridTextControl text={error} error={true}/> : undefined}
          </Grid>
        </DialogContent>
        {this.getActions()}
      </Dialog>
    );
  }
}

export default PasswordForgottenDialog;