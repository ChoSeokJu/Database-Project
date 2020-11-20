import React from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Eval(props) {
  const { user: currentUser } = useSelector((state) => state.authentication);

  if (!currentUser || currentUser.role !== 'eval') {
    return <Redirect to="/" />;
  }

  return (
    <>
      <p>평가자</p>
    </>
  );
}
