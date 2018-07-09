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
        <DialogTitle style={{marginBottom: '12px'}}>
          <AppBar>
            <Toolbar>
              <IconButton
                color='inherit'
                aria-label='Close'
                style={{position: 'absolute', left: '8px', zIndex: 20}}
                onClick={this.handleRequestClose}>
                <IconClose/>
              </IconButton>
              <Typography
                type='title'
                color='inherit'
                style={{marginTop: '4px', width: '100%', textAlign: 'center'}}>
                {title}
              </Typography>
              <div style={{position: 'absolute', right: '8px', zIndex: 20}}>
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