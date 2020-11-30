import React from 'react';
import {
  Redirect, Switch, useRouteMatch, Route,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { TaskTableSubmit, TaskRequest } from '../../components';

export default function Submit(props) {
  const { user: currentUser } = useSelector((state) => state.authentication);
  const { path } = useRouteMatch();

  if (!currentUser || currentUser.role !== 'submit') {
    return <Redirect to="/" />;
  }

  return (
    // <>
    //   <p>{message}</p>
    // </>
    <>
      <Switch>
        <Route exact path={path}>
          <TaskTableSubmit />
        </Route>
        <Route path={`${path}/task`}>
          <TaskRequest />
        </Route>
      </Switch>
    </>
  );
}
