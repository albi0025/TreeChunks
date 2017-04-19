import React from 'react';
import { Panel, Form, Button } from 'react-bootstrap';
import Chunks from './Chunks';

class Chunk extends React.Component {

  constructor() {
    super();
    this.state = {
      story: [],
      content: "",
      chunks: []
    };

    this.perpareChunks = this.prepareChunks.bind(this);
    this.submitChunkHandler = this.submitChunkHandler.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.getChunks = this.getChunks.bind(this);
  }

  componentWillMount(){
    this.prepareChunks(this.props.params.chunkId, []);
    this.getChunks(this.props.params.chunkId);
  }

  componentWillReceiveProps(nextProps){
    this.prepareChunks(nextProps.params.chunkId, []);
    this.getChunks(nextProps.params.chunkId);
  }

  handleContentChange(e) {
    this.setState({content: e.target.value});
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
      story.push(res.content);
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
    });
  }

  render() {

    return (
      <div>
        <Panel>
          {this.state.story}
        </Panel>
        <Panel>
          <Chunks chunks = {this.state.chunks}/>
        </Panel>
        <Form>
          <textarea onChange={this.handleContentChange} type="text" name="content" rows="10" cols="30"  placeholder="Content"/>
          <br/>
          <Button onClick={this.submitChunkHandler} type="submit">Submit</Button>
        </Form>
      </div>
    );
  }
}

Chunk.propTypes = {
  params: React.PropTypes.object
};

export default Chunk;
