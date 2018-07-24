'use strict';
import React, {Component} from 'react';
import classnames from 'classnames';
import {withStyles} from '@material-ui/core/styles';
import {bindActionCreators} from 'redux';
import compose from 'recompose/compose';
import {connect} from 'react-redux';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import {GridButtonControl, GridInputControl, GridTextControl} from './../../components/general';
import {loginDataChanged, sendContact} from '../../model/contact';
import {ValidationGroup, Validators} from './../general/validation';
import {IconExpandMore} from './../../utils/Icons';

const styles = theme => ({
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  }
});

class ContactCard extends Component {

  state = {
    autoFilled: false,
    expanded: false
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

  handleExpandClick = () => {
    this.setState(state => ({expanded: !state.expanded}));
  };

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
    const {contact, classes, actions} = this.props;
    const {loginDataChanged} = actions;
    const {data, pending, errorMessage} = contact;

    return (
      <Grid item xs={12} sm={8} md={5}>
        <Card>
          <CardHeader title='Kontakt'/>
          <CardContent>
            <Grid container spacing={16} justify="center" style={{width: '100%', margin: '0px'}}>
              <GridTextControl
                xs={10}
                text={'Du hast Lust auf ein Probetraining oder möchtest Freya eine Nachricht schrieben? Dann los:'}/>
              <Grid item xs={2}>
                <IconButton
                  className={classnames(classes.expand, {
                    [classes.expandOpen]: this.state.expanded,
                  })}
                  onClick={this.handleExpandClick}
                  aria-expanded={this.state.expanded}
                  aria-label="Show more"
                >
                  <IconExpandMore/>
                </IconButton>
              </Grid>
            </Grid>
          </CardContent>
          <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
            <CardContent>
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
            </CardContent>
          </Collapse>
        </Card>
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
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ContactCard);