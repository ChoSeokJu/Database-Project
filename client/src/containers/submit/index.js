import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getSubmit } from '../../services/user.service';

export default function Submit(props) {
  const { user: currentUser } = useSelector((state) => state.authentication);

  const [message, setMessage] = useState('');

  useEffect(() => {
    getSubmit('')
      .then((response) => {
        setMessage(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [currentUser]);

  if (!currentUser || currentUser.role !== 'submit') {
    return <Redirect to="/" />;
  }

  return (
    <>
      <p>{message}</p>
    </>
  );
}
