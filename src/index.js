import 'bootstrap/dist/css/bootstrap.css';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import { render } from 'react-dom';
import React from 'react';
import { Provider } from 'mobx-react';
import UserStore from './stores/UserStore';
import App from './components/App';
import Story from './components/Story';
import Chunk from './components/Chunk';
import TreeChunkStore from './stores/TreeChunkStore';

const userStore = new UserStore();
const treeChunkStore = new TreeChunkStore();

render((
  <Provider treeChunkStore={treeChunkStore} userStore={userStore}>
    <Router history={hashHistory}>
      <Route path="/" component={App}/>
      <Route path= "/story/:treeId/:chunkId" component={Story}/>
      <Route path= "/chunk/:chunkId" component={Chunk}/>
    </Router>
  </Provider>
),

document.getElementById('app'));
