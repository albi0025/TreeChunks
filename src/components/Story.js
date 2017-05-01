import React from 'react';
import { Panel, Button, Form, Badge } from 'react-bootstrap';
import Chunks from './Chunks';
import { hashHistory, Link } from 'react-router';
import NewChunkForm from './NewChunkForm';
import { observer, inject } from 'mobx-react';
import ReactTooltip from 'react-tooltip';


class Story extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tree: {},
      chunks: [],
      story: []
    };
    this.fetchTree = this.fetchTree.bind(this);
    this.getChunks = this.getChunks.bind(this);
    this.prepareStory = this.prepareStory.bind(this);
  }

  componentWillMount(){ //need to change this as well
    this.fetchTree(this.props.params.treeId, this.props.params.chunkId);
    this.prepareStory(this.props.params.chunkId, []);
  }

  componentWillReceiveProps(nextProps){
    this.fetchTree(nextProps.params.treeId, nextProps.params.chunkId);
    this.prepareStory(nextProps.params.chunkId, []);
  }

  fetchTree(treeId, chunkId){  //Need to change this so refresh works correct
    fetch("/getTree/" + treeId, {
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
    }).then(()=>{this.getChunks(chunkId);});
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

  prepareStory(chunkId, story){
    fetch("/getStory/" + chunkId, {
      method:"GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    })
    .then(result => result.json())
    .then(res => {
      story.push(<Link key={res._id} className="storyChunk" to= {{pathname: '/Story/' + this.state.tree._id+ '/' + res._id}}>{res.content+ " "}</Link>);
      if(typeof(res.parentchunk) == "string"){
        this.prepareStory(res.parentchunk, story);
      } else {
        story.reverse();
        this.setState({
          story: story
        });
      }
    });
  }

  checkUrl(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
  }

  render() {
    if(this.state.tree.chunk){
      let coverImage = (this.checkUrl(this.state.tree.cover))
      ? this.state.tree.cover
      : "/images/coverlogo.png";
      return (
      <div key={this.state.tree._id} className= "container-fluid story-background-image"
      style={{backgroundImage: "url("+coverImage+")"}} >
        <div className="container-fluid story-background-gradient">
          <div className="story-content container-fluid">
            <div className="tree-info">
              <div style={{ fontFamily: "'Walter Turncoat', cursive"}}>{this.state.tree.title}</div>
            </div>
            <Panel className="story">
              Here is the story so far: <br/>
                <p data-tip="Click to go back in the story...">{this.state.story}</p><ReactTooltip />
            </Panel>
            <div className="chunkDisplay">
              {(this.props.userStore.loggedIn)
              ?<NewChunkForm maxWords={this.state.tree.maxWords} chunkId={this.props.params.chunkId} treeId={this.state.tree._id}/>
              : ""}
              <Chunks chunks={this.state.chunks} treeId={this.state.tree._id}/>
            </div>
          </div>
        </div>
      </div>
      );}else{
      return (<div/>);
    }
  }
}

Story.propTypes = {
  params: React.PropTypes.object,
  userStore: React.PropTypes.object
};

export default inject("userStore")(observer(Story));
