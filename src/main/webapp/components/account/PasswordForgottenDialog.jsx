'use strict';
import React, {Component} from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {ValidationGroup, Validators} from './../general/validation';
import {GridInputControl, GridTextControl} from './../general';
import {Dialog, LoadingIndicator} from '../general';

class PasswordForgottenDialog extends Component {

  validateForm = () => {
    const result = this.validationGroup.validate();
    return result.valid;
  };

  setValidation = ref => {
    this.validationGroup = ref;
  };

  doPasswordForgotten = () => {
    if (this.validateForm()) {
      const {formData, onSave} = this.props;
      const passwordForgottenData = {
        email: formData.email
      };
      return onSave(passwordForgottenData);
    }
  };

  render() {
    const {open, onClose, error, pending, formData, formDataChanged} = this.props;

    return (
      <Dialog
        title='Passwort vergessen?'
        onClose={onClose}
        fullScreen={false}
        open={open}>

        <DialogContent>
          <Grid container spacing={16} justify='center' style={{width: '100%', margin: '0px'}}>
            <ValidationGroup ref={this.setValidation}>
              <GridTextControl
                text={'Du bist bereits angemeldet, hast aber dein Password vergessen? Kein Problem, wir schicken dir gerne eine E-Mail, wo du dein Password zurücksetzen kannst.'}/>
              <GridInputControl
                id='email'
                label='E-Mail'
                type='email'
                value={formData.email}
                validators={[Validators.email()]}
                onChange={formDataChanged}/>
            </ValidationGroup>
            {error ? <GridTextControl text={error} error={true}/> : undefined}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.doPasswordForgotten} color='primary' disabled={pending}>
            {'zurücksetzen'}
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

export default PasswordForgottenDialog;