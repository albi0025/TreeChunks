import React from 'react';
import { Panel, Button } from 'react-bootstrap';
import { Link } from 'react-router';

class Tree extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
    this.adjustPopularity = this.adjustPopularity.bind(this);
    this.upChunk = this.upChunk.bind(this);
    this.downChunk = this.downChunk.bind(this);
    this.checkUrl = this.checkUrl.bind(this);
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

  checkUrl(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
  }

  render() {
    return (
      <Panel key={this.props.tree._id}>
        <Link to= {{pathname: '/Story/' + this.props.tree._id + "/" + this.props.tree.chunk._id}}>
          <div>
            {this.props.tree.title}
            <br/>
            {
              (this.checkUrl(this.props.tree.cover)) ? <img src={this.props.tree.cover} alt="Cover" height="200" width="150"/> : ""
            }
            <br/>
            {this.props.tree.chunk.content}
            <br/>
            {this.props.tree.popularity}
          </div>
        </Link>
        <br/>
        <Button onClick={this.upChunk}>Up</Button>
        <Button onClick={this.downChunk}>Down</Button>
      </Panel>
    );
  }
}

Tree.propTypes = {
  tree: React.PropTypes.object
};

export default Tree;
