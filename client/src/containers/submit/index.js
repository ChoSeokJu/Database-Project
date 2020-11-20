import React from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Submit(props) {
  const { user: currentUser } = useSelector((state) => state.authentication);

  if (!currentUser || currentUser.role !== 'submit') {
    return <Redirect to="/" />;
  }

  return (
    <>
      <p>Submit</p>
    </>
  );
}
