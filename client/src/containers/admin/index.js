import React from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { TaskTableAdmin } from '../../components';

export default function Admin(props) {
  const { user: currentUser } = useSelector((state) => state.authentication);

  if (!currentUser || currentUser.role !== 'admin') {
    return <Redirect to="/" />;
  }

  return (
    <>
      <Container component="main" maxWidth="md">
        <TaskTableAdmin />
      </Container>
    </>
  );
}
