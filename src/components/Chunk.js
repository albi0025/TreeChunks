import React from 'react';
import { Panel, Form, Button, Glyphicon, Badge } from 'react-bootstrap';
import { Link, hashHistory } from 'react-router';
import { observer, inject } from 'mobx-react';
import ReactTooltip from 'react-tooltip';


class Chunk extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      chunk: this.props.chunk,
      popularity: this.props.chunk.popularity
    };

    this.upChunk = this.upChunk.bind(this);
    this.unUpChunk = this.unUpChunk.bind(this);
    this.unDownChunk = this.unDownChunk.bind(this);
    this.downChunk = this.downChunk.bind(this);
    this.adjustPopularity = this.adjustPopularity.bind(this);
    this.checkForUpChunk = this.checkForUpChunk.bind(this);
    this.checkForDownChunk = this.checkForDownChunk.bind(this);
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
          treeId: this.props.treeId,
          adjustment: adjust
        })
      });
    })
    .then(this.setState({popularity: this.state.popularity + adjust}));
  }

  upChunk(){
    this.props.userStore.flagUserUpChunk(this.props.chunk._id);
    if(this.checkForDownChunk()){
      this.props.userStore.unFlagUserDownChunk(this.props.chunk._id);
      this.adjustPopularity(this.props.chunk._id, 2);
    } else {
      this.adjustPopularity(this.props.chunk._id, 1);
    }
  }

  unUpChunk(){
    this.props.userStore.unFlagUserUpChunk(this.props.chunk._id);
    this.adjustPopularity(this.props.chunk._id, -1);
  }

  downChunk(){
    this.props.userStore.flagUserDownChunk(this.props.chunk._id);
    if(this.checkForUpChunk()){
      this.props.userStore.unFlagUserUpChunk(this.props.chunk._id);
      this.adjustPopularity(this.props.chunk._id, -2);
    } else{
      this.adjustPopularity(this.props.chunk._id, -1);
    }
  }

  unDownChunk(){
    this.props.userStore.unFlagUserDownChunk(this.props.chunk._id);
    this.adjustPopularity(this.props.chunk._id, 1);
  }

  checkForUpChunk(){
    let upchunks = this.props.userStore.user.upchunks || [];
    return upchunks.find((chunk) => {
      return (this.props.chunk._id == chunk);
    });
  }

  checkForDownChunk(){
    let downchunks = this.props.userStore.user.downchunks || [];
    return downchunks.find((chunk) => {
      return (this.props.chunk._id == chunk);
    });
  }

  render() {
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
    if(this.state.chunk && this.props.chunk.owner == this.props.userStore.user._id && this.props.chunk.children.length < 1){
      return (
        <Panel className="chunk" key={this.state.chunk._id}>
          <div>
            <Link style={{fontSize: "30px", textDecoration: "none"}} to= {{pathname: '/Story/' + this.props.treeId + "/" + this.state.chunk._id}}>
            <p data-tip="Add this next...">{this.state.chunk.content}</p><ReactTooltip /></Link>
          </div>
        <div className="popularity">
          {thumbUpButton}
            <Badge>
              <p data-tip="How Popular This Addition Is... Go Ahead...Vote!">{this.state.popularity}</p><ReactTooltip delayShow={1000} />
            </Badge>
          {thumbDownButton}
        </div>
        <Button style={{float: "right"}} onClick={() => this.props.deleteChunk(this.state.chunk._id)} ><Glyphicon glyph="trash"/></Button>
        </Panel>
      );
    }
    else if(this.state.chunk){
      return (
        <Panel className="chunk" key={this.state.chunk._id}>
          <div>
            <Link style={{fontSize: "30px", textDecoration: "none"}} to= {{pathname: '/Story/' + this.props.treeId + "/" + this.state.chunk._id}}>
            <p data-tip="Add this next...">{this.state.chunk.content}</p><ReactTooltip /></Link>
          </div>
        <div className="popularity">
          {thumbUpButton}
            <Badge>
              <p data-tip="How Popular This Addition Is... Go Ahead...Vote!">{this.state.popularity}</p><ReactTooltip delayShow={1000} />
            </Badge>
          {thumbDownButton}
        </div>
        </Panel>
      );
    }

  }
}

Chunk.propTypes = {
  story: React.PropTypes.object,
  chunk: React.PropTypes.object,
  treeId: React.PropTypes.string,
  userStore: React.PropTypes.object,
  deleteChunk: React.PropTypes.func
};

export default inject("userStore")(observer(Chunk));
