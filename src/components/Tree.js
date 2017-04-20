import React from 'react';
import { Panel, Button } from 'react-bootstrap';

class Tree extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
    this.adjustPopularity = this.adjustPopularity.bind(this);
    this.upChunk = this.upChunk.bind(this);
    this.downChunk = this.downChunk.bind(this);
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


  render() {
    return (
      <Panel key={this.props.tree._id}>
        {this.props.tree.title}
        <br/>
        {this.props.tree.cover}
        <br/>
        {this.props.tree.chunk.content}
        <br/>
        {this.props.tree.popularity}
        <br/>
        <Button onClick = {this.upChunk}>Up</Button>
        <Button onClick = {this.downChunk}>Down</Button>
      </Panel>
    );
  }
}

Tree.propTypes = {
  tree: React.PropTypes.object
};

export default Tree;
