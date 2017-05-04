import React from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { hashHistory } from 'react-router';
import { observer, inject } from 'mobx-react';

class FullStoryModal extends React.Component {
  constructor() {
    super();
    this.state = {
      story: ""
    };

    this.prepareMostPopularStory = this.prepareMostPopularStory.bind(this);
  }

  componentWillMount(){ //need to change this as well
    this.prepareMostPopularStory(this.props.chunkId, []);
  }

  componentWillReceiveProps(nextProps){
    this.prepareMostPopularStory(nextProps.chunkId, []);
  }

  prepareMostPopularStory(chunkId, story){
    fetch("/getChunk/" + chunkId, {
      method:"GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    })
    .then(result => result.json())
    .then(res => {
      story += res.content+ " ";
      if(res.children.length > 0){
        fetch("/getMostPopularChild/" + chunkId, {
          method:"GET",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        })
        .then(result => result.json())
        .then(res => {
          this.prepareMostPopularStory(res._id, story);
        });
      } else {
        this.setState({
          story: story
        });
      }
    });
  }

  render() {
    return (
      <Modal {...this.props} aria-labelledby="contained-modal-title-sm">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg card-text">The Most Popular Storyline</Modal.Title>
        </Modal.Header>
        <Modal.Body className="quick-read" style={{margin: "50px"}}>
          <p>{this.state.story}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

FullStoryModal.propTypes = {
  onHide: React.PropTypes.func,
  chunkId: React.PropTypes.string
};
export default inject("userStore")(observer(FullStoryModal));
