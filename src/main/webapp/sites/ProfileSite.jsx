'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {IconBatteryLow, IconCamera, IconLineChart, IconLockClosed} from './../utils/Icons';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import {ProfilePicture, ProfilePictureDialog} from './../components/profile';
import {ChangePasswordDialog} from '../components/account';
import {LoadingIndicator, Subheader} from '../components/general';
import {
  changeTempProfilePicture,
  closeProfilePictureChangeDialog,
  fetchOwnProfile,
  onProfileDetailsChange,
  openProfilePictureChangeDialog,
  saveProfilePicture
} from './../model/profile';
import {changePassword, onCancelPasswordChange, onOpenPasswordChange, onPasswordChange} from './../model/password';
import {withStyles} from "@material-ui/core/styles/index";
import * as Style from "../utils/Style";
import {viewPath} from "../utils/RamdaUtils";
import {red} from "@material-ui/core/colors/index";
import Membership from './../components/membership';

class ProfileSite extends Component {

  renderMemberships = () => {
    const memberships = viewPath(['profile', 'user', 'memberships'], this.props) || [];
    return (
      <Grid item xs={12} sm={8}>
        <Card>
          <List style={{padding: '0'}}>
            <Subheader label='Deine Mitgliedschaft'/>
            {
              memberships.map((value, idx) => <Membership membership={value} key={idx}/>)
            }
          </List>
        </Card>
      </Grid>
    );
  };

  render() {
    const {
      profile,
      password,
      actions
    } = this.props;

    if (profile.pending) {
      return (<LoadingIndicator/>);
    } else {
      const {user = {}} = profile;
      const {
        id,
        firstname = '',
        lastname = '',
        dayOfBirth,
        email,
        mobil,
        adress = {},
        roles,
        memberships
      } = user;

      return (
        <div className={this.props.classes.root}>
          <Grid container spacing={16} justify="center" style={{width: '100%', margin: '0px'}}>
            <Grid item xs={12} sm={8} style={{padding: '0px'}}>
              <div style={{position: 'relative', width: '100%', paddingTop: '75%'}}>
                <div style={{position: 'absolute', top: '0px', height: '100%', width: '100%', zIndex: -20}}>
                  <ProfilePicture user={profile.user} size='LG' style={{width: '100%'}}/>
                </div>
                <div style={{position: 'absolute', bottom: '0px', right: '24px'}}>
                  <Button
                    variant='fab'
                    color='secondary'
                    aria-label='edit'
                    onClick={actions.openProfilePictureChangeDialog}>
                    <IconCamera/>
                  </Button>
                </div>
              </div>

              <Card style={{margin: '8px'}}>
                <CardHeader title={firstname + " " + lastname}/>
                <CardContent>
                  {
                    /*
                    <Typography variant='caption'>Über mich</Typography>
                    <Typography>Hier kann man ganz tolle Sachen über sich schreiben.</Typography>
                    */
                  }
                  <Typography variant='caption'>E-Mail</Typography>
                  <Typography>{email}</Typography>
                </CardContent>
              </Card>
            </Grid>

            {this.renderMemberships()}

            <Grid item xs={12} sm={8}>
              <Card>
                <List style={{padding: '0'}}>
                  <ListItem button>
                    <ListItemIcon>
                      <IconLineChart/>
                    </ListItemIcon>
                    <ListItemText primary={"Statistiken (folgt)"}/>
                  </ListItem>
                  <ListItem button onClick={() => actions.onOpenPasswordChange()}>
                    <ListItemIcon>
                      <IconLockClosed/>
                    </ListItemIcon>
                    <ListItemText primary={"Passwort ändern"}/>
                  </ListItem>
                </List>
              </Card>
            </Grid>
          </Grid>

          <ProfilePictureDialog
            show={profile.picture.dialog.open}
            temp={profile.picture.temp}
            pending={profile.picture.pending}
            errorMessage={profile.picture.errorMessage}
            changeTempProfilePicture={actions.changeTempProfilePicture}
            onSave={actions.saveProfilePicture}
            onClose={actions.closeProfilePictureChangeDialog}
          />
          <ChangePasswordDialog
            formData={password}
            pending={password.pending}
            open={password.open}
            errorMessage={password.errorMessage}
            onClose={actions.onCancelPasswordChange}
            onPasswordChange={actions.onPasswordChange}
            onSave={actions.changePassword}
          />
        </div>
      );
    }
  }
}

const mapStateToProps = state => ({
  profile: state.profile,
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
)(ProfileSite);