'use strict';
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
import {togglePath, viewPath} from '../../utils/RamdaUtils';
import {
  setLoginRef,
  login,
  loginDataChanged,
  createAccount,
  createAccountDataChanged,
} from '../../model/profile';

class LoginAndRegistrationCard extends Component {

  constructor(props) {
    super(props);
    this.state = {showLogin: true};
  }

  toggleForm = () => {
    this.setState(togglePath(['showLogin'], this.state));
  };

  render() {
    const {showLogin} = this.state;
    const loginData = viewPath(['profile', 'login', 'data'], this.props);
    const loginPending = viewPath(['profile', 'login', 'pending'], this.props);
    const loginError = viewPath(['profile', 'login', 'error'], this.props);
    const createAccountData = viewPath(['profile', 'createAccount', 'data'], this.props);
    const createAccountPending = viewPath(['profile', 'createAccount', 'pending'], this.props);
    const createAccountError = viewPath(['profile', 'createAccount', 'error'], this.props);
    const {
      setLoginRef,
      login,
      loginDataChanged,
      createAccount,
      createAccountDataChanged,
    } = this.props.actions;
    return (
      <div ref={setLoginRef}>
        <Card>
          <Tabs
            value={showLogin ? 0 : 1}
            onChange={this.toggleForm}
            indicatorColor='primary'
            fullWidth>
            <Tab label='Login'/>
            <Tab label='Konto erstellen'/>
          </Tabs>
          <CardContent>
            {
              showLogin
                ? <LoginForm
                  login={login}
                  pending={loginPending}
                  error={loginError}
                  formData={loginData}
                  formDataChanged={loginDataChanged}/>
                : <RegistrationForm
                  createAccount={createAccount}
                  pending={createAccountPending}
                  error={createAccountError}
                  formData={createAccountData}
                  formDataChanged={createAccountDataChanged}/>
            }
          </CardContent>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  profile: state.profile,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    // profile
    setLoginRef: setLoginRef,
    login: login,
    loginDataChanged: loginDataChanged,
    createAccount:createAccount,
    createAccountDataChanged: createAccountDataChanged,
  }, dispatch),
  dispatch
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginAndRegistrationCard);