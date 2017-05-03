import React from 'react';
import { Panel, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import Chunk from './Chunk';

class Chunks extends React.Component {

  constructor() {
    super();
    this.prepareChunks = this.prepareChunks.bind(this);
  }

  prepareChunks(){
    return this.props.chunks.map(function(chunk){
      return(
        <Chunk key={chunk._id} deleteChunk={this.props.deleteChunk} chunk={chunk} treeId={this.props.treeId}/>
      );
    },this);
  }


  render() {
    return (
      <div className="chunks">
        {this.prepareChunks()}
      </div>
    );
  }
}

Chunks.propTypes = {
  chunks: React.PropTypes.array,
  treeId: React.PropTypes.string,
  deleteChunk: React.PropTypes.func
};

export default Chunks;
