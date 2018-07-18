'use strict';
import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {Dialog, GridTextControl} from '.';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import {togglePath} from '../../utils/RamdaUtils';

class ConfirmButton extends Component {

  state = {
    show: false
  };

  showDialog = () => {
    this.setState(state => togglePath(['show'], state));
  };

  hideDialog = () => {
    this.setState(state => togglePath(['show'], state));
  };

  render() {
    const {show} = this.state;
    const {onClick, title, question, pending, children, fullScreen = false, ...props} = this.props;

    return <div>
      <Button onClick={this.showDialog} {...props}>
        {children}
      </Button>

      <Dialog
        title={!!title ? title : 'Bist du sicher?'}
        onClose={this.hideDialog}
        fullScreen={fullScreen}
        open={show}>
        <DialogContent>
          <Grid container spacing={16}>
            <GridTextControl text={question}/>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {onClick(); this.hideDialog();}}
            color="primary"
            disabled={pending}>
            Ja
          </Button>
          <Button
            onClick={this.hideDialog}
            disabled={pending}>
            Nein
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  }

}

export default ConfirmButton;
