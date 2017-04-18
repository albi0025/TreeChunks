import React from 'react';
import Home from './Home';
import Navigation from './Navigation';
import DisplayPets from './DisplayPets';
import { Button, Col, Row, Thumbnail, Grid } from 'react-bootstrap';
import { observer, inject } from 'mobx-react';

class App extends React.Component {

  constructor() {
    super();
  }

  componentDidMount() {
    this.props.userStore.getUserFromDb();
  }

  render() {
    return (
      <div>
        <Navigation/>
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  userStore: React.PropTypes.object
};

export default inject("userStore")(observer(App));
