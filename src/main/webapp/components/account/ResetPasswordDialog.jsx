'use strict';
import React, {Component} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Slide from '@material-ui/core/Slide';
import {IconClose} from '../../utils/Icons';
import {blueGrey, red} from '@material-ui/core/colors/index';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import {ValidationGroup, Validators} from './../general/validation';
import {GridPasswordControl, GridTextControl} from './../general';
import {LoadingIndicator} from '../general';

function Transition(props) {
  return <Slide direction='up' {...props} />;
}

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

        <Button onClick={onClose} color='primary' disabled={pending}>
          {'Abbrechen'}
        </Button>
      </DialogActions>;
    }
  };

  render() {
    const {open, onClose} = this.props;

    return (
      <Dialog
        onClose={onClose}
        fullScreen={false}
        transitionComponent={Transition}
        open={open}>

        <DialogTitle
          disableTypography
          style={{
            color: 'white',
            background: blueGrey[800],
            display: 'flex',
            padding: '2px 0'
          }}>
          <IconButton
            style={{color: 'white', marginLeft: '8px', zIndex: '10'}}
            onClick={onClose} aria-label='Close'>
            <IconClose/>
          </IconButton>
          <Typography
            type='title'
            style={{
              color: 'white',
              position: 'absolute',
              width: '100%',
              textAlign: 'center',
              padding: '14px 0',
              zIndex: '5'
            }}>
            {'Passwort vergessen?'}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={16} justify='center' style={{width: '100%', margin: '0px'}}>
            {this.getContent()}
          </Grid>
        </DialogContent>
        {this.getActions()}
      </Dialog>
    );
  }
}

export default withMobileDialog()(PasswordForgottenDialog);