import React from 'react';
import { Panel, Button } from 'react-bootstrap';

class Tree extends React.Component {

  constructor() {
    super();
    this.state = {
      trees: []
    };
    this.fetchTrees = this.fetchTrees.bind(this);
    this.adjustPopularity = this.adjustPopularity.bind(this);
  }

  componentWillMount(){
    this.fetchTrees();
  }

  adjustPopularity(treeId, adjust){
    // e.preventDefault();
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

  fetchTrees(){
    fetch("/getTrees",{
      method:"GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    })
    .then(result => result.json())
    .then(res => {
      this.setState({
        trees: res
      });
    });
  }

  prepareTrees(){
    return this.state.trees.map(function(tree){
      return(
        <Panel key={tree._id}>
          {tree.title}
          <br/>
          {tree.cover}
          <br/>
          {tree.chunk[0].content}
          <br/>
          {tree.popularity}
          <br/>
          <Button onClick = {this.adjustPopularity(tree._id, 1)}>Up</Button>
          <Button onClick = {this.adjustPopularity(tree._id, -1)}>Down</Button>
        </Panel>
      );
    },this);
  }


  render() {
    let trees = this.prepareTrees();

    return (
      <Panel>
        {trees}
      </Panel>
    );
  }
}

Tree.propTypes = {
  content: React.PropTypes.string,
  popularity: React.PropTypes.number
};

export default Tree;
