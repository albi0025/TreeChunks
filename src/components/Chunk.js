import React from 'react';
import { Panel} from 'react-bootstrap';

class Chunk extends React.Component {

  constructor() {
    super();
  }

  render() {
    return (
      <Panel>
        {this.props.content}
        {this.props.popularity}
        Im a chunk!
      </Panel>
    );
  }
}

Chunk.propTypes = {
  content: React.PropTypes.string,
  popularity: React.PropTypes.number
};

export default Chunk;
