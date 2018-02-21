'use strict';
import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import {
  default as MaterialDialog,
  DialogTitle,
  withMobileDialog
} from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';

import {FaClose} from 'react-icons/lib/fa';
import {blueGrey} from 'material-ui/colors';

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
        transition={Transition}
        open={open}>
        <DialogTitle>
        <AppBar style={{background: blueGrey[800], position: 'absolute'}}>
          <Toolbar>
            <IconButton
              color='contrast'
              aria-label='Close'
              style={{
                zIndex: 20
              }}
              onClick={this.handleRequestClose}>
              <FaClose/>
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