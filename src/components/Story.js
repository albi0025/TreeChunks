import React from 'react';
import { Panel, Button, Form } from 'react-bootstrap';
import Chunks from './Chunks';
import { hashHistory } from 'react-router';

class Story extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tree: {},
      content: "",
      chunks: [],
      story: []
    };
    this.fetchTree = this.fetchTree.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.submitChunkHandler = this.submitChunkHandler.bind(this);
    this.getChunks = this.getChunks.bind(this);
    this.prepareChunks = this.prepareChunks.bind(this);
  }

  componentWillMount(){
    this.fetchTree();
    this.prepareChunks(this.props.params.chunkId, []);
  }

  componentWillReceiveProps(nextProps){
    this.prepareChunks(nextProps.params.chunkId, []);
    this.getChunks(nextProps.params.chunkId);
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
    }).then(()=>{this.getChunks(this.state.tree.chunk._id);});
  }

  handleContentChange(e) {
    this.setState({content: e.target.value});
  }

  getChunks(chunkId){
    fetch("/getChunks/" + chunkId,{
      method:"GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    })
    .then(result => result.json())
    .then(data => this.setState({chunks: data}));
  }

  prepareChunks(chunkId, story){
    fetch("/getStory/" + chunkId, {
      method:"GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    })
    .then(result => result.json())
    .then(res => {
      story.push(res.content + " ");
      if(typeof(res.parentchunk) == "string"){
        this.prepareChunks(res.parentchunk, story);
      } else {
        story.reverse();
        this.setState({
          story: story
        });
      }
    });
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
        parentchunk: this.props.params.chunkId
      })
    })
    .then(res => res.json())
    .then(res => {
      let chunks = this.state.chunks;
      chunks.push(res);
      this.setState({
        chunks: chunks,
        content: ""
      });
      hashHistory.push('/Story/' + this.state.tree._id + "/" + res._id);
    });
  }

  render() {
    if(this.state.tree.chunk){
      return (
      <div>
        <Panel key={this.state.tree._id}>
          {this.state.tree.title}
          <br/>
          {this.state.tree.cover}
          <br/>
          {this.state.tree.chunk.content}
          <br/>
          {this.state.tree.popularity}
        </Panel>
        <Panel>
          {this.state.story}
        </Panel>
        <Panel>
          <Chunks chunks={this.state.chunks} treeId={this.state.tree._id}/>
        </Panel>
        <Form>
          <textarea onChange={this.handleContentChange} type="text" name="content" rows="10" cols="30" value={this.state.content} placeholder="Content"/>
          <br/>
          <Button onClick={this.submitChunkHandler} type="submit">Submit</Button>
        </Form>
      </div>
      );}else{
      return (<div/>);
    }
  }
}

Story.propTypes = {
  params: React.PropTypes.object
};

export default Story;
