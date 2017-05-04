import React from 'react';
import { Form, Button} from 'react-bootstrap';
import { hashHistory } from 'react-router';
import { observer, inject } from 'mobx-react';


class NewChunkForm extends React.Component {

  constructor() {
    super();
    this.state = {
      content: ""
    };

    this.handleContentChange = this.handleContentChange.bind(this);
    this.submitChunkHandler = this.submitChunkHandler.bind(this);
  }

  handleContentChange(e) {
    if(e.target.value.split(/ /).length + (e.target.value.split("\n").length - 1) <= this.props.maxWords) {
      this.setState({content: e.target.value});
    }
  }

  submitChunkHandler(e){
    e.preventDefault();
    fetch("/newChunk",{
      method:"POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: this.state.content,
        parentchunk: this.props.chunkId,
        owner: this.props.userStore.user._id,
        date: new Date()
      })
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        content: ""
      });
      fetch("/newChildChunk",{
        method:"PUT",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          parentId: this.props.chunkId,
          childId: res._id
        })
      });

      hashHistory.push('/Story/' + this.props.treeId + "/" + res._id);
    });
  }

  render() {
    return (
      <Form style={{marginRight: "50px"}}>
        <textarea style={{width:"500px", fontSize:"22px", fontFamily:"Rokkitt"}} onChange={this.handleContentChange} type="text" name="content" rows="10" cols="30" value={this.state.content}
        placeholder="Add on to the story above or click through the options on the right."/>
        <br/>
        <Button onClick={this.submitChunkHandler} type="submit">Submit</Button>
      </Form>
    );
  }
}

NewChunkForm.propTypes = {
  chunkId: React.PropTypes.string,
  treeId: React.PropTypes.string,
  userStore: React.PropTypes.object,
  maxWords: React.PropTypes.number
};

export default inject("userStore")(observer(NewChunkForm));
