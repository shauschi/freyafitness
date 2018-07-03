'use strict';
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import {LoginForm, RegistrationForm, PasswordForgottenDialog, ResetPasswordDialog} from '.';
import {setPath, viewPath} from '../../utils/RamdaUtils';
import {
  showLogin,
  showRegistration,
  setLoginRef,
  login,
  loginDataChanged,
  createAccount,
  createAccountDataChanged,
  showPasswordForgotten,
  hidePasswordForgotten,
  passwordForgottenDataChanged,
  passwordForgotten,
  resetPasswordDataChanged,
  resetPassword
} from '../../model/profile';


class LoginAndRegistrationCard extends Component {

  state = {
    showPasswordForgotten: false,
    showResetPassword: false
  };

  onTabChange = (event, value) => {
    console.warn("tab change", value);
    if (value === 0) {
      this.props.actions.showLogin();
    } else {
      this.props.actions.showRegistration();
    }
  };

  getCurrentCard = () => {
    const {showLogin} = this.props.profile;
    const tabIdx = showLogin ? 0 : 1;
    if (tabIdx === 0) {
      const {
        login,
        loginDataChanged,
        showPasswordForgotten,
      } = this.props.actions;
      const loginData = viewPath(['profile', 'login', 'data'], this.props);
      const loginPending = viewPath(['profile', 'login', 'pending'], this.props);
      const loginError = viewPath(['profile', 'login', 'error'], this.props);
      return <LoginForm
        login={login}
        pending={loginPending}
        error={loginError}
        formData={loginData}
        formDataChanged={loginDataChanged}
        showPasswordForgotten={showPasswordForgotten}
      />;
    }
    if (tabIdx === 1) {
      const {
        createAccount,
        createAccountDataChanged,
      } = this.props.actions;
      const createAccountData = viewPath(['profile', 'createAccount', 'data'], this.props);
      const createAccountPending = viewPath(['profile', 'createAccount', 'pending'], this.props);
      const createAccountError = viewPath(['profile', 'createAccount', 'error'], this.props);
      return <RegistrationForm
        createAccount={createAccount}
        pending={createAccountPending}
        error={createAccountError}
        formData={createAccountData}
        formDataChanged={createAccountDataChanged}/>;
    }
    throw new Error("unknown tabIdx: " + tabIdx);
  };

  hideResetPassword = () => {
    // global variables from index.html
    RESET_PASSWORD = false;
    RESET_PASSWORD_TOKEN = null;
    ERROR_MESSAGE = null;

    // "update" the state
    this.setState(this.state);
  };

  render() {
    const {showLogin} = this.props.profile;
    const tabIdx = showLogin ? 0 : 1;
    const showResetPassword = RESET_PASSWORD; // global variable from index.html
    const errorMessage = ERROR_MESSAGE; // global variable from index.html
    const showPasswordForgotten = viewPath(['profile', 'passwordForgotten', 'show'], this.props);
    const pendingPasswordForgotten = viewPath(['profile', 'passwordForgotten', 'pending'], this.props);
    const passwordForgottenData = viewPath(['profile', 'passwordForgotten', 'data'], this.props);
    const resetPasswordData = viewPath(['profile', 'resetPassword', 'data'], this.props);
    const {
      setLoginRef,
      hidePasswordForgotten,
      passwordForgottenDataChanged,
      passwordForgotten,
      resetPasswordDataChanged,
      resetPassword
    } = this.props.actions;
    return (
      <div ref={setLoginRef}>
        <Card>
          <Tabs
            value={tabIdx}
            onChange={this.onTabChange}
            indicatorColor='primary'
            fullWidth>
            <Tab label='Login'/>
            <Tab label='Konto erstellen'/>
          </Tabs>
          <CardContent>
            <PasswordForgottenDialog
              open={showPasswordForgotten}
              pending={pendingPasswordForgotten}
              onClose={hidePasswordForgotten}
              formData={passwordForgottenData}
              formDataChanged={passwordForgottenDataChanged}
              onSave={passwordForgotten}
            />
            <ResetPasswordDialog
              open={showResetPassword}
              errorMessage={errorMessage}
              onClose={this.hideResetPassword}
              formData={resetPasswordData}
              formDataChanged={resetPasswordDataChanged}
              onSave={resetPassword}
            />
            {this.getCurrentCard()}
          </CardContent>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  profile: state.profile
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    // profile
    showLogin: showLogin,
    showRegistration: showRegistration,
    setLoginRef: setLoginRef,
    login: login,
    loginDataChanged: loginDataChanged,
    createAccount:createAccount,
    createAccountDataChanged: createAccountDataChanged,
    showPasswordForgotten: showPasswordForgotten,
    hidePasswordForgotten: hidePasswordForgotten,
    passwordForgottenDataChanged: passwordForgottenDataChanged,
    passwordForgotten: passwordForgotten,
    resetPasswordDataChanged: resetPasswordDataChanged,
    resetPassword: resetPassword
  }, dispatch),
  dispatch
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginAndRegistrationCard);