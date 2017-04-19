import React from 'react';
import { Panel, Button, Form } from 'react-bootstrap';


class Story extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tree: {},
      content: ""
    };
    this.fetchTree = this.fetchTree.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.submitChunkHandler = this.submitChunkHandler.bind(this);
  }

  componentWillMount(){
    this.fetchTree();
  }

  fetchTree(){
    fetch("/getTree/" + this.props.params.treeId, {
      method:"GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    })
    .then(result => result.json())
    .then(res => {
      this.setState({
        tree: res
      });
    });
  }

  handleContentChange(e) {
    this.setState({content: e.target.value});
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
        parentchunk:this.state.tree.chunk[0]._id
      })
    });
  }

  render() {
    console.log(this.state.tree);
    return (
    <div>
      <Panel key={this.state.tree._id}>
        {this.state.tree.title}
        <br/>
        {this.state.tree.cover}
        <br/>
        {this.state.tree.chunk[0].content}
        <br/>
        {this.state.tree.popularity}
      </Panel>
      <Form>
        <textarea onChange={this.handleContentChange} type="text" name="content" rows="10" cols="30" value={this.state.content} placeholder="Content"/>
        <br/>
        <Button onClick={this.submitChunkHandler} type="submit">Submit</Button>
      </Form>
    </div>
    );
  }
}

Story.propTypes = {
  params: React.PropTypes.object
};

export default Story;
