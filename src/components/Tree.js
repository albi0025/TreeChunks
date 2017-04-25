import React from 'react';
import { Panel, Button, Glyphicon, Badge } from 'react-bootstrap';
import { Link } from 'react-router';
import { observer, inject } from 'mobx-react';

class Tree extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
    this.adjustPopularity = this.adjustPopularity.bind(this);
    this.upChunk = this.upChunk.bind(this);
    this.downChunk = this.downChunk.bind(this);
    this.checkUrl = this.checkUrl.bind(this);
    this.handleTreeFollow = this.handleTreeFollow.bind(this);
    this.handleTreeUnFollow = this.handleTreeUnFollow.bind(this);
    this.checkForFollowing = this.checkForFollowing.bind(this);
  }

  handleTreeFollow(){
    this.props.userStore.followTree(this.props.tree._id);
  }

  handleTreeUnFollow(){
    this.props.userStore.unFollowTree(this.props.tree._id);
  }

  adjustPopularity(treeId, adjust){
    fetch("/adjustTree",{
      method:"PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chunkId: treeId,
        adjustment: adjust
      })
    });
  }

  upChunk(){
    this.adjustPopularity(this.props.tree._id, 1);
  }

  downChunk(){
    this.adjustPopularity(this.props.tree._id, -1);
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
    let followButton = "";
    if(this.props.userStore.loggedIn){
      followButton = (<Button onClick={this.handleTreeFollow}>Follow <Glyphicon style={{color: "gold", fontSize: "18px"}} glyph="star"/></Button>);
      if(this.checkForFollowing()){
        followButton = (<Button onClick={this.handleTreeUnFollow}>Un Follow Tree</Button>);
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
            <Glyphicon glyph="thumbs-up" onClick={this.upChunk}/>
            <Badge>
              {this.props.tree.popularity}
            </Badge>
            <Glyphicon glyph="thumbs-down" onClick={this.downChunk}/>
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
