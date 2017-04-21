import React from 'react';
import { Panel, Button, Glyphicon, Badge } from 'react-bootstrap';
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
      <Panel className="tree-panel" key={this.props.tree._id}>
        <Link to= {{pathname: '/Story/' + this.props.tree._id + "/" + this.props.tree.chunk._id}}>
          <div>
            <h2>{this.props.tree.title}</h2>
            <br/>
            {
              (this.checkUrl(this.props.tree.cover)) ? <img src={this.props.tree.cover} alt="Cover" height="200" width="150"/> : ""
            }
            <br/>
            {this.props.tree.chunk.content}
            <br/>

          </div>
        </Link>
        <br/>
        <div className="popularity">
          <Glyphicon glyph="thumbs-up" onClick={this.upChunk}/>
          <Badge>
            {this.props.tree.popularity}
          </Badge>
          <Glyphicon glyph="thumbs-down" onClick={this.downChunk}/>
        </div>
      </Panel>
    );
  }
}

Tree.propTypes = {
  tree: React.PropTypes.object
};

export default Tree;
