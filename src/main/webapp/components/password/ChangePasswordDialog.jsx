'use strict';
import React, {Component} from 'react';
import Dialog, {DialogActions, DialogContent, DialogTitle, withMobileDialog} from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';
import List, {ListItem, ListItemIcon} from 'material-ui/List';
import {FaClose} from 'react-icons/lib/fa';
import {blueGrey} from "material-ui/colors/index";
import FormControl from "material-ui/Form/FormControl";
import Input, {InputLabel} from "material-ui/Input";
import IconButton from "material-ui/IconButton";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const Row = ({icon, id, label, type, value, endAdornment, onChange, inset, readonly, backgroundColor}) => {
  return (
    <ListItem style={{backgroundColor: backgroundColor}} inset={inset}>
      {icon ? <ListItemIcon>{icon}</ListItemIcon> : undefined}
      <FormControl fullWidth>
        <InputLabel htmlFor={id}>{label}</InputLabel>
        <Input id={id} type={type}
               endAdornment={endAdornment}
               value={value}
               onChange={event => onChange(event.target.value)}
               disabled={readonly}/>
      </FormControl>
    </ListItem>
  );
};


class ChangePasswordDialog extends Component {

  render() {

    const {show, password, onPasswordChange} = this.props;
    const {passwordOld, passwordNew, passwordNewConfirm} = password || {};

    return (
      <Dialog
        onRequestClose={this.handleRequestClose}
        fullScreen={false}
        transition={Transition}
        open={show}>

        <DialogTitle disableTypography
                     style={{color: 'white', background: blueGrey.A700, display: 'flex', padding: '2px 0'}}>
          <IconButton style={{color: 'white', marginLeft: '8px'}}
                      onClick={this.handleRequestClose} aria-label="Close">
            <FaClose/>
          </IconButton>
          <Typography type="title" style={{color: 'white', position: 'absolute', width: '100%', textAlign: 'center', padding: '14px 0'}}>
            {'Passwort ändern'}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <List>
            <Row id="passwordOld" label="Altes Passwort" value={passwordOld} type='password'
                 inset
                 readonly={false} /* TODO */
                 onChange={value => onPasswordChange(['passwordNew'], value)}
                 icon={undefined /* TODO ??? */}/>
            <Row id="passwordNew" label="Neues Passwort" value={passwordNew} type='password'
                 inset
                 readonly={false} /* TODO */
                 onChange={value => onPasswordChange(['passwordNew'], value)}
                 icon={undefined /* TODO ??? */}/>
            <Row id="passwordNewConfirm" label="Passwort bestätigen" value={passwordNewConfirm} type='password'
                 inset
                 readonly={false} /* TODO */
                 onChange={value => onPasswordChange(['passwordNewConfirm'], value)}
                 icon={undefined /* TODO ??? */}/>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.signInOut} color="primary">
            {'Abbrechen'}
          </Button>
          <Button onClick={this.signInOut} color="primary">
            {'Speichern'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withMobileDialog()(ChangePasswordDialog);