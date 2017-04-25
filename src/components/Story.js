import React from 'react';
import { Panel, Button, Form, Badge } from 'react-bootstrap';
import Chunks from './Chunks';
import { hashHistory, Link } from 'react-router';
import NewChunkForm from './NewChunkForm';


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

  componentWillMount(){
    this.fetchTree();
    this.prepareStory(this.props.params.chunkId, []);
  }

  componentWillReceiveProps(nextProps){
    this.prepareStory(nextProps.params.chunkId, []);
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
      story.push(<Link key={res._id} className="storyChunk" to= {{pathname: '/Story/' + this.state.treeId + '/' + res._id}}>{res.content+ " "}</Link>);
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
          <div className="story-content container-fluid"> {/*}add container-fluid here*/}
            <div className="tree-info">
              <h2>{this.state.tree.title}</h2>
              <div className="popularity">
                <Badge>{this.state.tree.popularity}</Badge>
              </div>
            </div>
            {/* Cackie had an idea to remove this.  <img src={coverImage} alt="Cover" height="200" width="150"/> /*}We can turn this into one line now that the logic is above.*/}
            <Panel>
              {this.state.story}
            </Panel>
            <div className="chunkDisplay">
              <NewChunkForm chunkId={this.props.params.chunkId} treeId={this.state.tree._id}/>
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
  params: React.PropTypes.object
};

export default Story;
