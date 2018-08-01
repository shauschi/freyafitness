'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import {GridSwitchControl, LoadingIndicator} from '../components/general';
import {
  changeTempProfilePicture,
  closeProfilePictureChangeDialog,
  fetchOwnProfile,
  onProfileDetailsChange,
  openProfilePictureChangeDialog,
  saveProfilePicture,
  updatePreference
} from './../model/profile';
import {changePassword, onCancelPasswordChange, onOpenPasswordChange, onPasswordChange} from './../model/password';
import {withStyles} from "@material-ui/core/styles/index";
import * as Style from "./../utils/Style";
import {findBy} from './../utils/RamdaUtils';

class Statistics extends Component {

  state = {
    expanded: null,
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  validateForm = () => {
    const result = this.validationGroup.validate();
    return result.valid;
  };

  setValidation = ref => {
    this.validationGroup = ref;
  };

  doChangePassword = () => {
    if (this.validateForm()) {
      const {password, actions} = this.props;
      const {changePassword} = actions;
      return changePassword(password.data);
    }
  };

  getSwitch = ({key, label, labelNotChecked = label}) => {
    const {user, actions} = this.props;
    const {updatePreference} = actions;
    const {preferences} = user;
    const preference = findBy('key', preferences, key) || {};
    const checked = preference.value === 'true' || preference.value === true;
    return (<GridSwitchControl
      value={checked}
      onChange={(id, value) => updatePreference({userId: user.id, key: key, value: value})}
      label={checked ? label : labelNotChecked}/>
    );
  }

  render() {
    const {profile} = this.props;
    if (profile.pending) {
      return (<LoadingIndicator/>);
    } else {

      return (
        <div className={this.props.classes.root}>
          <Grid container spacing={16} justify="center" style={{width: '100%', margin: '0px'}}>
            <Grid item xs={12} sm={8}>
              <Card>
                <CardHeader title='Statistiken und PR'/>
                <CardContent>
                  <Typography>
                    Hier sollen zukünftig deine Statistiken aufgeführt werden. Zum Beispiel, wie oft du im letzten Monat an Kursen teilgenommen hast.
                  </Typography>
                  <Typography>
                    PR steht für Personal Record, also deine ganz eigenen Bestleistungen. Diese sollst du hier zukünftig verwalten und auch mit anderen vergleichen können.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

          </Grid>
        </div>
      );
    }
  }
}

const mapStateToProps = state => ({
  profile: state.profile,
  user: state.profile.user,
  password: state.password
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    // profile
    fetchOwnProfile: fetchOwnProfile,
    onProfileDetailsChange: onProfileDetailsChange,
    openProfilePictureChangeDialog: openProfilePictureChangeDialog,
    closeProfilePictureChangeDialog: closeProfilePictureChangeDialog,
    saveProfilePicture: saveProfilePicture,
    changeTempProfilePicture: changeTempProfilePicture,
    updatePreference: updatePreference,

    // password
    onPasswordChange: onPasswordChange,
    onOpenPasswordChange: onOpenPasswordChange,
    onCancelPasswordChange: onCancelPasswordChange,
    changePassword: changePassword
  }, dispatch),
  dispatch
});

export default compose(
  withStyles(Style.APP_STYLES, {withTheme: true}),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Statistics);