/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { connect } from 'react-redux';
import { LoginComp } from '../components';
import { registerRequest } from '../actions/authentication';

class Register extends React.Component {
  render() {
    return (
      <div>
        <LoginComp />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  status: state.authentication.register.status,
  errorCode: state.authentication.register.error,
});

const mapDispatchToProps = (dispatch) => ({
  registerRequest: (id, pw) => dispatch(registerRequest(id, pw)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
