'use strict';
import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import {default as MaterialDialog} from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Slide from '@material-ui/core/Slide';

import {IconClose} from '../../utils/Icons';
import {blueGrey} from '@material-ui/core/colors';

function Transition(props) {
  return <Slide direction='up' {...props} />;
}

class Dialog extends Component {

  constructor(props) {
    super(props);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleRequestSave = this.handleRequestSave.bind(this);
  }

  handleRequestClose = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  handleRequestSave = (value) => {
    if (this.props.onSave) {
      this.props.onSave(value);
    }
  };

  render()
  {
    const {
      title,
      fullScreen,
      open,
      children,
      secondAction
    } = this.props;

    return (
      <MaterialDialog
        onClose={this.handleRequestClose}
        fullScreen={fullScreen}
        TransitionComponent={Transition}
        open={open}>
        <DialogTitle>
        <AppBar style={{background: blueGrey[800], position: 'absolute'}}>
          <Toolbar>
            <IconButton
              aria-label='Close'
              style={{
                zIndex: 20
              }}
              onClick={this.handleRequestClose}>
              <IconClose/>
            </IconButton>
            <Typography
              type='title'
              style={{
                color: 'white',
                zIndex: 10,
                position: 'absolute',
                left: 0,
                width: '100%',
                textAlign: 'center',
                fontSize: '23px',
                fontWeight: 'bold',
                textShadow: '-2px -2px 0px #444'
              }}>
              {title}
            </Typography>
            <div
              style={{
                position: 'absolute',
                right: '0px',
                padding: '0 12px',
                zIndex: 20
              }}
            >
              {secondAction}
            </div>
          </Toolbar>
        </AppBar>
        </DialogTitle>
        {children}
      </MaterialDialog>
    );
  };
}

export default withMobileDialog()(Dialog);