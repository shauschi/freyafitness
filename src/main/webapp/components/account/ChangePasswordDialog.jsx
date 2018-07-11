'use strict';
import React, {Component} from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import {red} from '@material-ui/core/colors/index';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import {ValidationGroup} from './../general/validation';
import {GridPasswordControl, GridTextControl} from './../general';
import {Validators} from '../general/validation';
import {Dialog, LoadingIndicator} from '../general';

class ChangePasswordDialog extends Component {

  validateForm = () => {
    const result = this.validationGroup.validate();
    return result.valid;
  };

  setValidation = ref => {
    this.validationGroup = ref;
  };

  doChangePassword = () => {
    if (this.validateForm()) {
      const {formData, onSave} = this.props;
      const changePasswordData = {
        oldPassword: formData.oldPassword,
        password: formData.password,
        matchingPassword: formData.matchingPassword,
      };
      return onSave(changePasswordData);
    }
  };

  render() {
    const {open, pending, formData, onPasswordChange, onClose, errorMessage} = this.props;
    const {oldPassword, password, matchingPassword} = formData;
    let error = undefined;
    if (errorMessage) {
      error = (<Typography style={{color: red.A200}}>{errorMessage}</Typography>);
    }

    return (
      <Dialog
        title={'Passwort ändern'}
        onClose={onClose}
        open={open}
        fullScreen={false}>

        <DialogContent>
          <Grid container spacing={16} justify='center' style={{width: '100%', margin: '0px'}}>
            <ValidationGroup ref={this.setValidation}>
              <GridTextControl
                text={'Ändere hier dein Password. Dein Password muss mindestens 8 Zeichen lang sein und sollte regelmäßig von dir geändert werden.'}/>
              <GridPasswordControl
                id='oldPassword'
                label='Aktuelles Password'
                value={oldPassword}
                onChange={(id, value) => onPasswordChange(['oldPassword'], value)}/>
              <GridPasswordControl
                id='password'
                label='Neues Password'
                value={password}
                validators={[Validators.minLength(8)]}
                onChange={(id, value) => onPasswordChange(['password'], value)}/>
              <GridPasswordControl
                id='matchingPassword'
                label='Password bestätigen'
                value={matchingPassword}
                validators={[Validators.matches(formData.password, 'Das neue Password stimmt nicht überein.')]}
                onChange={(id, value) => onPasswordChange(['matchingPassword'], value)}/>
            </ValidationGroup>
            {error}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.doChangePassword} color='primary' disabled={pending}>
            {'Speichern'}
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
        </DialogActions>
      </Dialog>
    );
  }
}

export default ChangePasswordDialog;