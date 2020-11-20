import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

export default function Home(props) {
  const { user: currentUser } = useSelector((state) => state.authentication);

  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  switch (currentUser.role) {
    case 'admin':
      return <Redirect to="/admin" />;
    case 'eval':
      return <Redirect to="/eval" />;
    case 'submit':
      return <Redirect to="/submit" />;
    default:
      return <Redirect to="/login" />;
  }
}
