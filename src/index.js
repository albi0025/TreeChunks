import 'bootstrap/dist/css/bootstrap.css';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import { render } from 'react-dom';
import React from 'react';
import { Provider } from 'mobx-react';
import UserStore from './stores/UserStore';
import App from './components/App';

const userStore = new UserStore();

render((
  <Provider userStore={userStore}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
      </Route>
    </Router>
  </Provider>
),

document.getElementById('app'));
