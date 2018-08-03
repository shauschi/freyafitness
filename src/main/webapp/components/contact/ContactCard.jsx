'use strict';
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import compose from 'recompose/compose';
import {connect} from 'react-redux';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Grid from '@material-ui/core/Grid';
import {GridButtonControl, GridInputControl, GridTextControl} from './../../components/general';
import {loginDataChanged, sendContact} from '../../model/contact';
import {ValidationGroup, Validators} from './../general/validation';
import {IconExpandMore} from './../../utils/Icons';


class ContactCard extends Component {

  state = {
    autoFilled: false
  };

  constructor(props) {
    super(props);
    if (props.user && !this.state.autoFilled) {
      const {loginDataChanged} = props.actions;

      loginDataChanged('firstname', props.user.firstname);
      loginDataChanged('lastname', props.user.lastname);
      loginDataChanged('email', props.user.email);
    }
  }

  validateForm = () => {
    const result = this.validationGroup.validate();
    return result.valid;
  };

  setValidation = ref => {
    this.validationGroup = ref;
  };

  doSendContact = () => {
    if (this.validateForm()) {
      const {sendContact} = this.props.actions;
      const {data} = this.props.contact;
      sendContact(data);
    }
  };

  validateContact = validator => value => {
    const {data} = this.props.contact;
    const {email, telephone} = data;
    if (Validators.notEmpty()(email).valid || Validators.notEmpty()(telephone).valid) {
      if (Validators.notEmpty()(value).valid) {
        return validator(value);
      } else {
        return {valid: true, error: null};
      }
    }
    return {valid: false, error: 'Bitte entweder eine E-Mail-Adresse oder Telefonnumer angeben'};
  };

  render() {
    const {contact, actions} = this.props;
    const {loginDataChanged} = actions;
    const {data, pending, errorMessage} = contact;

    return (
      <Grid item xs={12} sm={8} md={12}>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<IconExpandMore/>}>
            <div>
              <Typography variant='subheading'>Kontakt</Typography>
              <Typography>Du hast Lust auf ein Probetraining oder möchtest Freya eine Nachricht schreiben? Dann los:</Typography>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container spacing={16} justify="center" style={{width: '100%', margin: '0px'}}>
              <ValidationGroup ref={this.setValidation}>
                <GridInputControl
                  id='firstname'
                  label='Vorname'
                  xs={6}
                  value={data.firstname}
                  validators={[Validators.notEmpty('Bitte gib deinen Vornamen ein')]}
                  onChange={loginDataChanged}/>
                <GridInputControl
                  id='lastname'
                  label='Nachname'
                  xs={6}
                  value={data.lastname}
                  validators={[Validators.notEmpty('Bitte gib deinen Nachnamen ein')]}
                  onChange={loginDataChanged}/>
                <GridInputControl
                  id='telephone'
                  label='Telefon'
                  value={data.telephone}
                  validators={[this.validateContact(Validators.telephone())]}
                  onChange={loginDataChanged}/>
                <GridInputControl
                  id='email'
                  label='E-Mail'
                  value={data.email}
                  validators={[this.validateContact(Validators.email())]}
                  onChange={loginDataChanged}/>
                <GridInputControl
                  id='subject'
                  label='Betreff'
                  value={data.subject}
                  validators={[Validators.notEmpty('Bitte gib einen Betreff an')]}
                  onChange={loginDataChanged}/>
                <GridInputControl
                  id='message'
                  label='Nachricht'
                  value={data.message}
                  multiline
                  validators={[Validators.notEmpty('Bitte trage hier deine Nachricht ein')]}
                  onChange={loginDataChanged}/>
                {errorMessage ? <GridTextControl text={errorMessage} error={true}/> : undefined}
                <GridButtonControl
                  pending={pending}
                  label='absenden'
                  onClick={this.doSendContact}/>
              </ValidationGroup>
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  user: state.profile.user,
  contact: state.contact
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    // contact
    sendContact: sendContact,
    loginDataChanged: loginDataChanged
  }, dispatch),
  dispatch
});


export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ContactCard);