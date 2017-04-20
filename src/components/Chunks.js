import React from 'react';
import { Panel, Button } from 'react-bootstrap';
import { Link } from 'react-router';

class Chunks extends React.Component {

  constructor() {
    super();
    this.prepareChunks = this.prepareChunks.bind(this);
    this.adjustPopularity = this.adjustPopularity.bind(this);
    this.upChunk = this.upChunk.bind(this);
    this.downChunk = this.downChunk.bind(this);
  }

  prepareChunks(){
    return this.props.chunks.map(function(chunk){
      return(
        <Panel key={chunk._id}><Link  to= {{pathname: '/Story/' + this.props.treeId + "/" + chunk._id}}>{chunk.content}</Link>
        {chunk.popularity}
        <Button onClick = {() => {this.upChunk(chunk._id);}}>Up</Button>
        <Button onClick = {() => {this.downChunk(chunk._id);}}>Down</Button>
        </Panel>
      );
    },this);
  }

  upChunk(id){
    this.adjustPopularity(id, 1);
  }

  downChunk(id){
    this.adjustPopularity(id, -1);
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
    });
  }

  render() {
    let chunks = this.prepareChunks();
    return (
      <div>
        {chunks}
      </div>
    );
  }
}

Chunks.propTypes = {
  chunks: React.PropTypes.array,
  treeId: React.PropTypes.string
};

export default Chunks;
