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
import {GridInputControl, GridTextControl} from './../general';
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
            <ValidationGroup ref={this.setValidation}>
              <GridTextControl
                text={'Du bist bereits angemeldet, hast aber dein Password vergessen? Kein Problem, wir schicken dir gerne eine E-Mail, wo du dein Password zurücksetzen kannst.'}/>
              <GridInputControl
                id='email'
                label='E-Mail'
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

          <Button onClick={onClose} color='primary' disabled={pending}>
            {'Abbrechen'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withMobileDialog()(PasswordForgottenDialog);