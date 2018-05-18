'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import moment from 'moment';
import List, {ListItem, ListItemText, ListItemIcon} from 'material-ui/List';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import {
  DialogContent,
  DialogActions,
} from 'material-ui/Dialog';
import {InputAdornment} from 'material-ui/Input';
import Collapse from 'material-ui/transitions/Collapse';
import Avatar from 'material-ui/Avatar';
import {TypeMapper} from '.';
import * as Format from '../../utils/Format';
import {ProfilePicture} from './../profile';
import {showNotification} from './../../model/notification';
import {Dialog, ListItemInput, ListItemSelect} from './../general';
import {MODE, NEW_COURSE} from './../../model/news';
import {TITLE_BG} from '../../utils/Style';

import {
  IconCalendar,
  IconClock,
  IconLocation,
  IconPencil,
  IconUser,
  IconUserGroup
} from '../../utils/Icons';

import {MdExpandMore, MdExpandLess} from 'react-icons/lib/md';
import {findById} from "../../utils/RamdaUtils";
import {LoadingIndicator} from "../general";

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
      showAttendees,
      course = NEW_COURSE,
      toggleAttendeeList,
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