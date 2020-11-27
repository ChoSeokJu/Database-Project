/* eslint-disable react/jsx-filename-extension */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Router, Switch, Route, Link,
} from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { closeAlert, clearMessage } from './actions/message';

import {
  Admin,
  Eval,
  Submit,
  Profile,
  Home,
  Login,
  Register,
} from './containers';

import { TopBar } from './components';

export const history = createBrowserHistory();

const App = () => {
  const { user: currentUser } = useSelector((state) => state.authentication);
  const { open, message, type } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   history.listen((location) => {
  //     dispatch(clearMessage()); // clear message when changing location
  //   });
  // }, [dispatch]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(closeAlert());
  };

  return (
    <>
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
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleClose}
          severity={type}
        >
          {message}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default App;
