/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { connect } from 'react-redux';
import { RegisterComp } from '../components';
import { registerRequest } from '../actions/authentication';

function Register(props) {
  const handleRegister = (req) =>
    props.registerRequest(req).then(() => {
      if (props.status === 'SUCCESS') {
        window.alert('Success!');
        props.history.push('/login');
        return true;
      }
      const errorMessage = [
        '유효하지 않은 아이디입니다',
        '비밀번호가 너무 짧습니다',
        '이미 존재하는 아이디입니다.',
      ];

      window.alert(errorMessage[props.errorCode - 1]);
      return false;
    });
  return <RegisterComp onRegister={handleRegister} />;
}

const mapStateToProps = (state) => ({
  status: state.authentication.register.status,
  errorCode: state.authentication.register.error,
});

const mapDispatchToProps = (dispatch) => ({
  registerRequest: (req) => dispatch(registerRequest(req)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
