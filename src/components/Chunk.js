import React from 'react';
import { Panel, Form, Button, Glyphicon, Badge } from 'react-bootstrap';
import { Link } from 'react-router';
import { observer, inject } from 'mobx-react';


class Chunk extends React.Component {

  constructor() {
    super();
    this.state = {
      chunk: {},
      popularity: null
    };

    this.upChunk = this.upChunk.bind(this);
    this.downChunk = this.downChunk.bind(this);
    this.adjustPopularity = this.adjustPopularity.bind(this);
  }

  componentWillMount(){
    this.setState({
      chunk: this.props.chunk,
      popularity: this.props.chunk.popularity
    });
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
    .then(this.setState({popularity: this.state.popularity + adjust}));
  }

  upChunk(){
    this.adjustPopularity(this.props.chunk._id, 1);
  }

  downChunk(){
    this.adjustPopularity(this.props.chunk._id, -1);
  }

  render() {
    if(this.state.chunk){
      return (
        <Panel className="chunk" key={this.state.chunk._id}>
          <Link  to= {{pathname: '/Story/' + this.props.treeId + "/" + this.state.chunk._id}}>
          {this.state.chunk.content}</Link>
        <br/>
        <div className="popularity">
          <Glyphicon glyph="thumbs-up" onClick={this.upChunk}/>
          <Badge>
            {this.state.popularity}
          </Badge>
          <Glyphicon glyph="thumbs-down" onClick={this.downChunk}/>
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
  treeId: React.PropTypes.string
};

export default inject("treeChunkStore")(observer(Chunk));
