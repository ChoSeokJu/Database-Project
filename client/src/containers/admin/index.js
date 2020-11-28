import React from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { Redirect, Switch, useRouteMatch, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { TaskTableAdmin, AppendTask, Requests } from '../../components';
import UserList from '../../components/admin/UserList';

export default function Admin(props) {
  const { user: currentUser } = useSelector((state) => state.authentication);
  const { path } = useRouteMatch();

  if (!currentUser || currentUser.role !== 'admin') {
    return <Redirect to="/" />;
  }

  return (
    <>
      <Switch>
        <Route exact path={path}>
          <TaskTableAdmin />
        </Route>
        <Route path={`${path}/task/append`}>
          <AppendTask />
        </Route>
        <Route path={`${path}/user`}>
          <UserList />
        </Route>
        <Route path={`${path}/requests`}>
          <Requests />
        </Route>
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </>
  );
}
