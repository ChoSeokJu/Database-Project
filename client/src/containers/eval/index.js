import React from 'react';
import {
  Redirect, Switch, useRouteMatch, Route,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { TaskRequest } from '../../components';

export default function Eval(props) {
  const { user: currentUser } = useSelector((state) => state.authentication);
  const { path } = useRouteMatch();

  if (!currentUser || currentUser.role !== 'eval') {
    return <Redirect to="/" />;
  }

  return (
    <>
      <Switch>
        <Route exact path={path}>
          <p>Submit</p>
        </Route>
        <Route path={`${path}/task`}>
          <TaskRequest />
        </Route>
      </Switch>
    </>
  );
}
