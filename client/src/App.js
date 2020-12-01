/* eslint-disable react/jsx-filename-extension */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Router, Switch, Route, Link } from 'react-router-dom';

import { createBrowserHistory } from 'history';
import {
  Admin,
  Eval,
  Submit,
  Profile,
  Home,
  Login,
  Register,
} from './containers';

import { clearMessage } from './actions/message';
import { TopBar } from './components';

export const history = createBrowserHistory();

const App = () => {
  const { user: currentUser } = useSelector((state) => state.authentication);
  const dispatch = useDispatch();

  useEffect(() => {
    history.listen((location) => {
      dispatch(clearMessage()); // clear message when changing location
    });
  }, [dispatch]);

  return (
    <Router history={history}>
      <div>
        {currentUser && <TopBar />}
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/profile" component={Profile} />
          <Route path="/eval" component={Eval} />
          <Route path="/submit" component={Submit} />
          <Route path="/admin" component={Admin} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
