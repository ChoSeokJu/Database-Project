/* eslint-disable react/jsx-filename-extension */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Admin from './admin';
import Eval from './eval';
import Submit from './submit';
import { TopBarComp } from '../components';
import UserInfo from './UserInfo';

function User(props) {
  const [isOnMyPage, setIsOnMyPage] = useState(false);

  useEffect(() => {
    if (!props.isLoggedIn) {
      // 로그인 안돼있다면 Login으로 push
      alert('Logged in!');
    }
  });

  return (
    // select a page depend on the state of user
    <>
      <TopBarComp
        onLogoClick={() => setIsOnMyPage(false)}
        onMyPageClick={() => setIsOnMyPage(true)}
        onLogoutClick={() => alert('logout!') /* NOTE: to be implemented */}
      />
      {isOnMyPage ? (
        <UserInfo />
      ) : (
        (props.userType === 'admin' && <Admin />) ||
        (props.userType === 'eval' && <Eval />) ||
        (props.userType === 'submit' && <Submit />)
      )}
    </>
  );
}

const mapStateToProps = (state) => ({
  userType: state.authentication.status.userType,
  isLoggedIn: state.authentication.status.isLoggedIn,
});

export default connect(mapStateToProps, null)(User);
