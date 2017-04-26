import React from 'react';
import { Panel, Button, Glyphicon, Badge } from 'react-bootstrap';
import { Link } from 'react-router';
import { observer, inject } from 'mobx-react';

class Tree extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      popularity: this.props.tree.popularity
    };
    this.upChunk = this.upChunk.bind(this);
    this.unUpChunk = this.unUpChunk.bind(this);
    this.unDownChunk = this.unDownChunk.bind(this);
    this.downChunk = this.downChunk.bind(this);
    this.adjustPopularity = this.adjustPopularity.bind(this);
    this.checkForUpChunk = this.checkForUpChunk.bind(this);
    this.checkForDownChunk = this.checkForDownChunk.bind(this);
    this.checkUrl = this.checkUrl.bind(this);
    this.handleTreeFollow = this.handleTreeFollow.bind(this);
    this.handleTreeUnFollow = this.handleTreeUnFollow.bind(this);
    this.checkForFollowing = this.checkForFollowing.bind(this);
    this.preparePreview = this.preparePreview.bind(this);
    this.mostPopularChild = this.mostPopularChild.bind(this);
    // this.totalPopularity = this.totalPopularity.bind(this);
  }

  handleTreeFollow(){
    this.props.userStore.followTree(this.props.tree._id);
  }

  handleTreeUnFollow(){
    this.props.userStore.unFollowTree(this.props.tree._id);
  }

  adjustPopularity(chunkId, adjust){
    fetch("/adjustChunk",{
      method:"PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chunkId: chunkId,
        adjustment: adjust
      })
    })
    .then(() => {
      fetch("/adjustTree",{
        method:"PUT",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          treeId: this.props.tree._id,
          adjustment: adjust
        })
      });
    })
    .then(this.setState({popularity: this.state.popularity + adjust}));
  }

  upChunk(){
    if(this.checkForDownChunk()){
      this.adjustPopularity(this.props.tree.chunk._id, 2);
      this.props.userStore.unFlagUserDownChunk(this.props.tree.chunk._id);
    } else {
      this.adjustPopularity(this.props.tree.chunk._id, 1);
    }
    this.props.userStore.flagUserUpChunk(this.props.tree.chunk._id);
  }

  unUpChunk(){
    this.adjustPopularity(this.props.tree.chunk._id, -1);
    this.props.userStore.unFlagUserUpChunk(this.props.tree.chunk._id);
  }

  downChunk(){
    if(this.checkForUpChunk()){
      this.adjustPopularity(this.props.tree.chunk._id, -2);
      this.props.userStore.unFlagUserUpChunk(this.props.tree.chunk._id);
    } else{
      this.adjustPopularity(this.props.tree.chunk._id, -1);
    }
    this.props.userStore.flagUserDownChunk(this.props.tree.chunk._id);
  }

  checkForDownChunk(){
    let downchunks = this.props.userStore.user.downchunks || [];
    return downchunks.find((chunk) => {
      return (this.props.tree.chunk._id == chunk);
    });
  }

  unDownChunk(){
    this.adjustPopularity(this.props.tree.chunk._id, 1);
    this.props.userStore.unFlagUserDownChunk(this.props.tree.chunk._id);
  }

  checkForUpChunk(){
    let upchunks = this.props.userStore.user.upchunks || [];
    return upchunks.find((chunk) => {
      return (this.props.tree.chunk._id == chunk);
    });
  }

  mostPopularChild(chunkId){
    return (fetch("/getChunks/" + chunkId,{
      method:"GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    }))
    .then(result => result.json());
  }

  preparePreview(chunkId, story){
    fetch("/getChunk/" + chunkId, {
      method:"GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    })
    .then(result => result.json())
    .then(res => {
      story.push(res.content+ " ");
      this.mostPopularChild(res.children);
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

  checkForFollowing(){
    let trees = this.props.userStore.user.trees || [];
    return trees.find((tree) => {
      return (this.props.tree._id == tree);
    });
  }

  render() {
    console.log(this.mostPopularChild(this.props.tree.chunk._id));
    let followButton = "";
    if(this.props.userStore.loggedIn){
      followButton = (<Button onClick={this.handleTreeFollow}>Follow <Glyphicon style={{color: "gold", fontSize: "18px"}} glyph="star"/></Button>);
      if(this.checkForFollowing()){
        followButton = (<Button onClick={this.handleTreeUnFollow}>Un Follow Tree</Button>);
      }
    }
    let thumbUpButton = <Glyphicon glyph="thumbs-up" className="unchunked"/>;
    let thumbDownButton = <Glyphicon glyph="thumbs-down" className="unchunked"/>;
    if(this.props.userStore.loggedIn){
      thumbUpButton = <Glyphicon glyph="thumbs-up" className="unchunked" onClick={this.upChunk}/>;
      if(this.checkForUpChunk()){
        thumbUpButton = <Glyphicon glyph="thumbs-up" className="upchunked" onClick={this.unUpChunk}/>;
      }
      thumbDownButton = <Glyphicon glyph="thumbs-down" className="unchunked" onClick={this.downChunk}/>;
      if(this.checkForDownChunk()){
        thumbDownButton = <Glyphicon glyph="thumbs-down" className="downchunked" onClick={this.unDownChunk}/>;
      }
    }
    return (
      <Panel className="tree-panel" key={this.props.tree._id}>
        <div className="trees-display">
          <Link to= {{pathname: '/Story/' + this.props.tree._id + "/" + this.props.tree.chunk._id}}>
          <div className="tree-columns">
            {
              (this.checkUrl(this.props.tree.cover))
              ? <img src={this.props.tree.cover} alt="Cover" height="200" width="150"/>
              : <img src="/images/coverlogo.png" height="200" width="150"/>
            }
          </div>
          </Link>
          <div className="tree-columns">
          <Link to= {{pathname: '/Story/' + this.props.tree._id + "/" + this.props.tree.chunk._id}}>
            <h3>{this.props.tree.title}</h3></Link>
            <p>most popular thread </p>
            <p>overall rating 1 million</p>
            <p><Glyphicon glyph="pencil" /> {this.props.userStore.user.name}</p>
            {followButton}
          </div>
          <div className="tree-columns">
            {this.props.tree.chunk.content}
          </div>
          <div className="popularity">
          {thumbUpButton}
            <Badge>
              {this.state.popularity}
            </Badge>
            {thumbDownButton}
          </div>
        </div>
      </Panel>
    );
  }
}

Tree.propTypes = {
  tree: React.PropTypes.object,
  userStore: React.PropTypes.object
};

export default inject("userStore")(observer(Tree));
