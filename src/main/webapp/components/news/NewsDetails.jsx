'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import {TypeMapper} from '.';
import {showNotification} from './../../model/notification';
import {Dialog} from './../general';
import {MODE, NEW_COURSE} from './../../model/news';

import {IconPencil} from '../../utils/Icons';
import {LoadingIndicator} from '../general';

class NewsDetails extends Component {

  handleRequestClose = () => {
    // TODO unsaved 000_user?
    this.props.onClose();
  };

  handleRequestSave = () => {
    // TODO onRequestSave
    this.props.onSave(this.props.course);
  };

  render() {
    const {mode = MODE.CREATE,
      show,
      pending,
      course = NEW_COURSE,
      toggleEditNews,
      onCourseDetailsChange,
      courseTypes,
      currentUser = {}
    } = this.props;

    const {title, readonly} = mode;
    if (pending) {
      return <LoadingIndicator/>;
    }

    const {roles = {}} = currentUser;
    return (
      <Dialog
        title={title}
        onClose={this.props.onClose}
        secondAction={
          (mode === MODE.VIEW && (roles.ADMIN || roles.TRAINER))
            ? <IconButton color='contrast' onClick={toggleEditNews}>
                <IconPencil/>
              </IconButton>
            : undefined
        }
        open={show}>
        <DialogContent style={{padding: '0', paddingTop: '12px'}}>
          <List>
            {'Foo'}
          </List>
        </DialogContent>

        <DialogActions>
          {
            mode === MODE.VIEW
            ? <Button key='news-details-button-1-a' color='primary' onClick={this.signInOut}>
                {signedIn ? 'Abmelden' : 'Teilnehmen'}
              </Button>
            : <Button key='news-details-button-1-b' onClick={this.handleRequestSave}>
                {'Speichern'}
              </Button>
          }
          {
            mode === MODE.VIEW
              ? <Button key='news-details-button-2-a' color='primary' onClick={this.handleRequestClose}>
                {'Schließen'}
              </Button>
              : <Button key='news-details-button-2-b' onClick={mode === MODE.MODIFY ? toggleEditNews : this.handleRequestClose}>
                {'Abbrechen'}
              </Button>
          }
        </DialogActions>
      </Dialog>
    );
  };
}

const mapStateToProps = state => ({
  currentUser: state.profile.user
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    showNotification: showNotification
  }, dispatch),
  dispatch
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(NewsDetails);