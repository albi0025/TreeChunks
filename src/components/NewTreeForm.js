import React from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { hashHistory } from 'react-router';
import { observer, inject } from 'mobx-react';

class NewTreeForm extends React.Component {

  constructor() {
    super();
    this.state = {
      title: "",
      cover: "",
      content: ""
    };

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleCoverChange = this.handleCoverChange.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.submitTreeHandler = this.submitTreeHandler.bind(this);
  }

  handleTitleChange(e) {
    this.setState({title: e.target.value});
  }

  handleCoverChange(e) {
    this.setState({cover: e.target.value});
  }

  handleContentChange(e) {
    this.setState({content: e.target.value});
  }

  submitTreeHandler(e){
    e.preventDefault();
    fetch("/newTree",{
      method:"POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: this.state.content,
        title: this.state.title,
        cover: this.state.cover,
        owner: this.props.userStore.user._id,
        date: new Date()
      })
    })
    .then(res => res.json())
    .then(res => {
      hashHistory.push('/Story/' + res._id + "/" + res.chunk);
    })
    .then(this.props.onHide);
  }

  render() {
    return (
      <Modal {...this.props} bsSize="large" aria-labelledby="contained-modal-title-sm">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg card-text">Start A New Tree</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <input onChange={this.handleTitleChange} type="text" name="title" value={this.state.title} placeholder="Title"/>
            <br/>
            <input onChange={this.handleCoverChange} type="text" name="cover" value={this.state.cover} placeholder="Cover"/>
            <br/>
            <textarea onChange={this.handleContentChange} type="text" name="content" rows="10" cols="30" value={this.state.content} placeholder="Content"/>
            <br/>
            <Button onClick={this.submitTreeHandler} type="submit">Submit</Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

NewTreeForm.propTypes = {
  onHide: React.PropTypes.func,
  content: React.PropTypes.string,
  popularity: React.PropTypes.number,
  userStore: React.PropTypes.object
};

export default inject("userStore")(observer(NewTreeForm));
