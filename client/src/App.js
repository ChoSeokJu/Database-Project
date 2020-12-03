/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { useSelector } from 'react-redux';
import { Router, Switch, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { FeedBacks, TopBar, Footer } from './components';

import {
  Admin,
  Eval,
  Submit,
  Profile,
  Home,
  Login,
  Register,
} from './containers';

export const history = createBrowserHistory();

const App = () => {
  const { user: currentUser } = useSelector((state) => state.authentication);

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
          <Footer />
        </div>
      </Router>
      <FeedBacks />
    </>
  );
};

export default App;
