'use strict';
import React, {Component} from 'react';
import Dialog, {DialogActions, DialogContent, DialogTitle, withMobileDialog} from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';
import {IconClose} from '../../utils/Icons';
import {red, blueGrey} from 'material-ui/colors/index';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import {ValidationGroup} from './../general/validation';
import {GridPasswordControl, GridTextControl} from './../general';
import {Validators} from "../general/validation";
import LoadingIndicator from "../general/LoadingIndicator";

function Transition(props) {
  return <Slide direction='up' {...props} />;
}

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
        onClose={onClose}
        fullScreen={false}
        transition={Transition}
        open={open}>

        <DialogTitle disableTypography
                     style={{color: 'white', background: blueGrey[800], display: 'flex', padding: '2px 0'}}>
          <IconButton style={{color: 'white', marginLeft: '8px', zIndex: '10'}}
                      onClick={onClose} aria-label='Close'>
            <IconClose/>
          </IconButton>
          <Typography type='title' style={{color: 'white', position: 'absolute', width: '100%', textAlign: 'center', padding: '14px 0', zIndex: '5'}}>
            {'Passwort ändern'}
          </Typography>
        </DialogTitle>

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

          <Button onClick={onClose} color='primary' disabled={pending}>
            {'Abbrechen'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withMobileDialog()(ChangePasswordDialog);