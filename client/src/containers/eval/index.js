import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getEval } from '../../services/user.service';

export default function Eval(props) {
  const { user: currentUser } = useSelector((state) => state.authentication);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getEval('')
      .then((response) => {
        setMessage(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [currentUser]);
  // only getEval(), postEval() are valid when user type is evaluator.

  if (!currentUser || currentUser.role !== 'eval') {
    return <Redirect to="/" />;
  }

  return (
    <>
      <p>{message}</p>
    </>
  );
}
