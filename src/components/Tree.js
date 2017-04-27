import React from 'react';
import { Panel, Button, Glyphicon, Badge } from 'react-bootstrap';
import { Link } from 'react-router';
import { observer, inject } from 'mobx-react';

class Tree extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      popularity: this.props.tree.popularity,
      mostPopularStory: "",
      author: ""
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
    this.fetchAuthor = this.fetchAuthor.bind(this);
  }

  componentWillMount(){
    this.preparePreview(this.props.tree.chunk._id, "", 0);
    this.fetchAuthor();
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

  preparePreview(chunkId, story, charcount){
    fetch("/getChunk/" + chunkId, {
      method:"GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    })
    .then(result => result.json())
    .then(res => {
      charcount += res.content.length;
      story += res.content+ " ";
      if(res.children.length > 0 && charcount < 400){
        fetch("/getMostPopularChild/" + chunkId, {
          method:"GET",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        })
        .then(result => result.json())
        .then(res => {
          this.preparePreview(res._id, story, charcount);
        });
      } else {
        this.setState({
          mostPopularStory: story.substr(0, 400) + " ..."
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

  fetchAuthor(){
    fetch("/getAuthor/" + this.props.tree._id, {
      method:"GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    })
    .then(result => result.json())
    .then(res => {
      this.setState({
        author: res
      });
    });
  }

  render() {
    let followButton = "";
    if(this.props.userStore.loggedIn){
      followButton = (<Button className="follow-button" onClick={this.handleTreeFollow}>Follow</Button>);
      if(this.checkForFollowing()){
        followButton = (<Button className="following-button" onClick={this.handleTreeUnFollow}/>);
      }
    }
    let thumbUpButton = <Glyphicon glyph="thumbs-up" className="unchunked"/>;
    let thumbDownButton = <Glyphicon glyph="thumbs-down" className="unchunked"/>;
    if(this.props.userStore.loggedIn && this.props.userStore.user.name){
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
            <p><Glyphicon glyph="pencil" /> {this.state.author}</p>
          {followButton}
          </div>
          <div className="tree-columns">
            {this.state.mostPopularStory}
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
