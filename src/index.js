import 'bootstrap/dist/css/bootstrap.css';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import { render } from 'react-dom';
import React from 'react';
import { Provider } from 'mobx-react';
import UserStore from './stores/UserStore';
import App from './components/App';
import Navigation from './components/Navigation';
import Story from './components/Story';
import TreeChunkStore from './stores/TreeChunkStore';
import UserDashboard from './components/UserDashboard';


const userStore = new UserStore();
const treeChunkStore = new TreeChunkStore();

render((
  <Provider treeChunkStore={treeChunkStore} userStore={userStore}>
    <Router history={hashHistory}>
      <Route path="/" component={Navigation}>
        <IndexRoute component={App}/>
        <Route path= "/UserDashboard" component={UserDashboard}/>
        <Route path= "/story/:treeId/:chunkId" component={Story}/>
        <Route path= "/trees" component={App}/>
      </Route>
    </Router>
  </Provider>
),

document.getElementById('app'));
