import 'bootstrap/dist/css/bootstrap.css';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import { render } from 'react-dom';
import React from 'react';
import { Provider } from 'mobx-react';
import UserStore from './stores/UserStore';
import Home from './components/Home';
import DisplayPets from './components/DisplayPets';
import App from './components/App';
import Login from './components/Login';
import CatDisplay from './components/CatDisplay';
import DogDisplay from './components/DogDisplay';
import FavoritesDisplay from './components/FavoritesDisplay';

const userStore = new UserStore();

render((
  <Provider userStore={userStore}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home}/>
        <Route path="/CatDisplay" component={CatDisplay}/>
        <Route path="/DogDisplay" component={DogDisplay}/>
        <Route path="/FavoritesDisplay" component={FavoritesDisplay}/>
      </Route>
    </Router>
  </Provider>
),

document.getElementById('app'));
