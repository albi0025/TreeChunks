import React from 'react';
import { Panel} from 'react-bootstrap';
import { Link } from 'react-router';

class Chunks extends React.Component {

  constructor() {
    super();
    this.prepareChunks = this.prepareChunks.bind(this);
  }

  prepareChunks(){
    return this.props.chunks.map(function(chunk){
      return(
        <Panel key={chunk._id}><Link  to= {{pathname: '/Chunk/' + chunk._id}}>{chunk.content}</Link></Panel>
      );
    },this);
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
  chunks: React.PropTypes.array
};

export default Chunks;
