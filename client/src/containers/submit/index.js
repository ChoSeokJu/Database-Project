import React, { useEffect, useState } from 'react';
import { Redirect, Switch, useRouteMatch, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getSubmit } from '../../services/user.service';
import { TaskTableSubmit, TaskRequest } from '../../components';


export default function Submit(props) {
  const { user: currentUser } = useSelector((state) => state.authentication);
  const { path } = useRouteMatch();

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
  // only getSubmit(), postSubmit() are valid when user type is submit.

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
        <Route path={`${path}/task/request`}>
          <TaskRequest />
        </Route>
      </Switch>
    </>
  );
}
