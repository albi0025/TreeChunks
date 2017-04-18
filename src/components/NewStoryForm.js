import React from 'react';
import { Form, Button} from 'react-bootstrap';

class Tree extends React.Component {

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
    fetch("/newTree",{
      method:"POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: this.state.content,
        title: this.state.title,
        cover: this.state.cover
      })
    });
  }

  render() {
    return (
      <Form>
        <input onChange={this.handleTitleChange} type="text" name="title" value={this.state.title} placeholder="Title"/>
        <br/>
        <input onChange={this.handleCoverChange} type="text" name="cover" value={this.state.cover} placeholder="Cover"/>
        <br/>
        <input onChange={this.handleContentChange} type="textarea" name="content" rows="10" cols="30" value={this.state.content} placeholder="Content"/>
        <br/>
        <Button onClick={this.submitTreeHandler} type="submit">Submit</Button>
      </Form>
    );
  }
}

Tree.propTypes = {
  content: React.PropTypes.string,
  popularity: React.PropTypes.number
};

export default Tree;
