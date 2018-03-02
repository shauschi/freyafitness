'use strict';
import React, {Component} from 'react';
import Dialog, {DialogActions, DialogContent, DialogTitle, withMobileDialog} from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';
import {ListItemInput} from './../general';
import List from 'material-ui/List';
import {IconClose} from '../../utils/Icons';
import {red, blueGrey} from "material-ui/colors/index";
import IconButton from "material-ui/IconButton";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ChangePasswordDialog extends Component {

  render() {
    const {password, onPasswordChange, onSave, onClose} = this.props;
    const {open = false, oldPassword, newPassword, newPasswordConfirm, errorMessage} = password || {};
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
                      onClick={onClose} aria-label="Close">
            <IconClose/>
          </IconButton>
          <Typography type="title" style={{color: 'white', position: 'absolute', width: '100%', textAlign: 'center', padding: '14px 0', zIndex: '5'}}>
            {'Passwort ändern'}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <List>
            <ListItemInput id="oldPassword" label="Altes Passwort" value={oldPassword} type='password'
                 readonly={false} /* TODO */
                 onChange={value => onPasswordChange(['newPassword'], value)}
                 icon={undefined /* TODO ??? */}/>
            <ListItemInput id="newPassword" label="Neues Passwort" value={newPassword} type='password'
                 readonly={false} /* TODO */
                 onChange={value => onPasswordChange(['newPassword'], value)}
                 icon={undefined /* TODO ??? */}/>
            <ListItemInput id="newPasswordConfirm" label="Passwort bestätigen" value={newPasswordConfirm} type='password'
                 readonly={false} /* TODO */
                 onChange={value => onPasswordChange(['newPasswordConfirm'], value)}
                 icon={undefined /* TODO ??? */}/>
            {error}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onSave(oldPassword, newPassword, newPasswordConfirm)} color="primary">
            {'Speichern'}
          </Button>
          <Button onClick={onClose} color="primary">
            {'Abbrechen'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withMobileDialog()(ChangePasswordDialog);