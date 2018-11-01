'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {findById, viewPath} from './../../utils/RamdaUtils';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import {ProfilePicture} from './../profile';
import {Dialog, GridDateControl, GridItemSelectControl, GridTextControl} from './../general';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import {ValidationGroup} from './../general/validation';
import {hideCreateMembership, onCreateMembershipDataChanged, createMembership} from '../../model/memberships';
import moment from 'moment/moment';
import * as Format from '../../utils/Format';
import {showNotification} from '../../model/notification';
import {updateUsers} from '../../model/profile';
import {TITLE_BG} from "../../utils/Style";
import {Validators} from "../general/validation";
import {getMembershipIcon} from '.';

class CreateMembership extends Component {

  handleRequestClose = () => {
    this.props.actions.hideCreateMembership();
  };

  handleRequestSave = () => {
    if (this.validateForm()) {
      const data = viewPath(['memberships', 'create', 'data'], this.props);
      this.props.actions.createMembership(data);
    }
  };

  validateForm = () => {
    const result = this.validationGroup.validate();
    return result.valid;
  };

  setValidation = ref => {
    this.validationGroup = ref;
  };

  render() {
    console.warn("render...");
    const {users, membershipTypes} = this.props;
    const {onCreateMembershipDataChanged, updateUsers} = this.props.actions;
    const {create} = this.props.memberships;
    const {
      show,
      pending,
      errorMessage,
      data
    } = create;
    const {userId, membershipTypeId, validity} = data;
    if (show && !pending && !users.pending) {
      console.warn("update users...");
      updateUsers();
    }
    const {
      key,
      description,
    } = findById(membershipTypes.data, membershipTypeId) || {};
    const user = findById(users.data, userId) || {};

    return (
      <Dialog
        title='Mitgliedschaft erstellen'
        onClose={this.handleRequestClose}
        open={show}>
        <DialogContent style={{padding: '0', paddingTop: '12px'}}>
          <Grid container spacing={8} style={{width: '100%', margin: '0px', padding: '16px'}}>
            <ValidationGroup ref={this.setValidation}>
              <GridTextControl
                text={'Lege hier eine neue Mitgliedschaft an.'}/>

              <Grid item xs={2} sm={1} style={{margin: 'auto'}}>
                <Avatar style={{backgroundColor: TITLE_BG}}>
                  <ProfilePicture user={user} asAvatar/>
                </Avatar>
              </Grid>
              <GridItemSelectControl
                xs={10}
                sm={5}
                id='user'
                label='Benutzer'
                value={userId}
                validators={[Validators.notEmpty()]}
                values={users.data}
                keyProp='id'
                valueProp={user => user.firstname + ' ' + user.lastname}
                onChange={value => onCreateMembershipDataChanged(['userId'], value)}
              />
              <Grid item xs={2} sm={1} style={{margin: 'auto'}}>
                <Avatar>
                  {getMembershipIcon(key)}
                </Avatar>
              </Grid>
              <GridItemSelectControl
                xs={10}
                sm={5}
                id='membershipTypeId'
                label='Mitgliedschaft'
                value={membershipTypeId}
                validators={[Validators.notEmpty()]}
                values={membershipTypes.data}
                keyProp='id'
                valueProp='name'
                onChange={value => onCreateMembershipDataChanged(['membershipTypeId'], value)}
              />
              <GridTextControl
                text={description}/>
              <GridDateControl
                xs={6}
                id='validity_from'
                label='Gültig von'
                value={validity.from ? moment(validity.from) : null}
                validators={[Validators.notEmpty()]}
                onChange={value => {
                  if (!value.isValid()) {
                    return;
                  }
                  onCreateMembershipDataChanged(['validity', 'from'], value.format(Format.TIMESTAMP_FORMAT));
                }}
              />
              <GridDateControl
                xs={6}
                id='validity_to'
                label='Gültig bis'
                value={validity.to ? moment(validity.to) : null}
                validators={[Validators.notEmpty()]}
                onChange={value => {
                  if (!value.isValid()) {
                    return;
                  }
                  onCreateMembershipDataChanged(['validity', 'to'], value.format(Format.TIMESTAMP_FORMAT));
                }}
              />
              {errorMessage ? <GridTextControl text={errorMessage} error={true}/> : undefined}
            </ValidationGroup>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color='primary' onClick={this.handleRequestSave} disabled={pending}>
            {'Speichern'}
          </Button>
          <Button onClick={this.handleRequestClose} disabled={pending}>
            {'Schließen'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
}

const mapStateToProps = state => ({
  membershipTypes: state.membershipTypes,
  users: state.profile.users,
  memberships: state.memberships
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    showNotification: showNotification,
    // users
    updateUsers: updateUsers,
    // membership
    hideCreateMembership: hideCreateMembership,
    onCreateMembershipDataChanged: onCreateMembershipDataChanged,
    createMembership: createMembership
  }, dispatch),
  dispatch
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(CreateMembership);