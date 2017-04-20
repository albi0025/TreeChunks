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
        <Chunk key={chunk._id} chunk={chunk} treeId={this.props.treeId}/>
      );
    },this);
  }


  render() {
    let chunks = this.prepareChunks();
    return (
      <div className="chunks">
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
