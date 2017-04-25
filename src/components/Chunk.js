import React from 'react';
import { Panel, Form, Button, Glyphicon, Badge } from 'react-bootstrap';
import { Link } from 'react-router';
import { observer, inject } from 'mobx-react';


class Chunk extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      chunk: this.props.chunk,  //We can set the initial state directly in the constructor, just need to pass props to constructor and super
      popularity: this.props.chunk.popularity
    };

    this.upChunk = this.upChunk.bind(this);
    this.unUpChunk = this.unUpChunk.bind(this);
    this.unDownChunk = this.unDownChunk.bind(this);
    this.downChunk = this.downChunk.bind(this);
    this.adjustPopularity = this.adjustPopularity.bind(this);
    this.checkForUpChunk = this.checkForUpChunk.bind(this);
    this.checkForDownChunk = this.checkForDownChunk.bind(this);  //We missed this bind
  }

  componentWillMount(){
    // this.setState({
    //   chunk: this.props.chunk,
    //   popularity: this.props.chunk.popularity
    // });
  }

  adjustPopularity(chunkId, adjust){
    console.log(adjust);
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
    .then(this.setState({popularity: this.state.popularity + adjust}));
  }

  upChunk(){
    if(this.checkForDownChunk()){
      this.adjustPopularity(this.props.chunk._id, 2);
      this.props.userStore.unFlagUserDownChunk(this.props.chunk._id);
    } else {
      this.adjustPopularity(this.props.chunk._id, 1);
    }
    this.props.userStore.flagUserUpChunk(this.props.chunk._id);
  }

  unUpChunk(){
    this.adjustPopularity(this.props.chunk._id, -1);
    this.props.userStore.unFlagUserUpChunk(this.props.chunk._id);
  }

  downChunk(){
    if(this.checkForUpChunk()){
      this.adjustPopularity(this.props.chunk._id, -2);
      this.props.userStore.unFlagUserUpChunk(this.props.chunk._id);
    } else{
      this.adjustPopularity(this.props.chunk._id, -1);
    }
    this.props.userStore.flagUserDownChunk(this.props.chunk._id);
  }

  unDownChunk(){
    this.adjustPopularity(this.props.chunk._id, 1);
    this.props.userStore.unFlagUserDownChunk(this.props.chunk._id);
  }

  checkForUpChunk(){
    return this.props.userStore.user.upchunks.find((chunk) => {
      return (this.props.chunk._id == chunk);
    });
  }

  checkForDownChunk(){
    return this.props.userStore.user.downchunks.find((chunk) => {
      return (this.props.chunk._id == chunk);
    });
  }

  render() {
    let thumbUpButton = <Glyphicon glyph="thumbs-up" className="unchunked"/>;
    let thumbDownButton = <Glyphicon glyph="thumbs-down" className="unchunked"/>;
    if(this.props.userStore.loggedIn){  // We cannot run these chuckforchunk functions if there is no user. need to check}
      thumbUpButton = <Glyphicon glyph="thumbs-up" className="unchunked" onClick={this.upChunk}/>;
      if(this.checkForUpChunk()){
        thumbUpButton = <Glyphicon glyph="thumbs-up" className="upchunked" onClick={this.unUpChunk}/>;
      }
      thumbDownButton = <Glyphicon glyph="thumbs-down" className="unchunked" onClick={this.downChunk}/>;
      if(this.checkForDownChunk()){
        thumbDownButton = <Glyphicon glyph="thumbs-down" className="downchunked" onClick={this.unDownChunk}/>;
      }
    }

    if(this.state.chunk){
      return (
        <Panel className="chunk" key={this.state.chunk._id}>
          <Link  to= {{pathname: '/Story/' + this.props.treeId + "/" + this.state.chunk._id}}>
          {this.state.chunk.content}</Link>
        <br/>
        <div className="popularity">
          {thumbUpButton} {/*All we need here is a call to the button. logic above*/}
            <Badge>
              {this.state.popularity}
            </Badge>
          {thumbDownButton}
        </div>
        </Panel>
      );
    }else{
      return (<div/>);
    }
  }
}

Chunk.propTypes = {
  chunk: React.PropTypes.object,
  treeId: React.PropTypes.string,
  userStore: React.PropTypes.object
};

export default inject("userStore")(observer(Chunk));
