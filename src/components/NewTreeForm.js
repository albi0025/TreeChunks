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
      content: "",
      maxWords: 100
    };
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleCoverChange = this.handleCoverChange.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.submitTreeHandler = this.submitTreeHandler.bind(this);
    this.handleWordCountChange = this.handleWordCountChange.bind(this);
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

  handleWordCountChange(e) {
    if(e.target.value >= 0){
      this.setState({maxWords: e.target.value});
    }
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
        date: new Date(),
        maxWords: this.state.maxWords
      })
    })
    .then(res => res.json())
    .then(res => {
      hashHistory.push('/Story/' + res._id + "/" + res.chunk);
    })
    .then(this.props.onHide)
    .then(res => {
      this.setState({
        title: "",
        cover: "",
        content: "",
        maxWords: 100
      });
    });
  }
  render() {
    return (
      <Modal {...this.props} bsSize="medium" aria-labelledby="contained-modal-title-sm">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg card-text">Start A New Tree</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{margin: "50px"}}>
          <Form style={{display:"flex", flexWrap:"wrap"}}>
            <div>
              <input maxLength="30" onChange={this.handleTitleChange} type="text" name="title" value={this.state.title} placeholder="Title"/>
              <br/>
              <input style={{width:"100%"}} onChange={this.handleCoverChange} type="text" name="cover" value={this.state.cover} placeholder="Cover (add link to image)"/>
              <br/>
              <label> max words : &nbsp; </label>
              <input onChange={this.handleWordCountChange} type="number" min="0" name="chunk length" value={this.state.maxWords} placeholder="word limit"/>
              <br/>
              <textarea onChange={this.handleContentChange} type="text" name="content" rows="9" cols="55" value={this.state.content} placeholder="Begining of story"/>
              <br/>
              <Button onClick={this.submitTreeHandler} type="submit">Submit</Button>
            </div>
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
