import React from 'react';
import { Button, Col, Row, Thumbnail, Grid } from 'react-bootstrap';
import { observer, inject } from 'mobx-react';
import Trees from './Trees';

class App extends React.Component {

  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <div className="header-text container-fluid text-center">
          <img src="/images/headertext.png" width="800"/>
        </div>
        <div className="tree-list-content container-fluid">
          <Trees />
        </div>
      </div>
    );
  }
}

App.propTypes = {
  userStore: React.PropTypes.object
};

export default inject("userStore")(observer(App));
