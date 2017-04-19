import React from 'react';
import { Button, Col, Row, Thumbnail, Grid } from 'react-bootstrap';
import { observer, inject } from 'mobx-react';
import Chunk from './Chunk';
import Trees from './Trees';
import NewStoryForm from './NewStoryForm';

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
      <Trees />
      <NewStoryForm />
      </div>
    );
  }
}

App.propTypes = {
  userStore: React.PropTypes.object
};

export default inject("userStore")(observer(App));
