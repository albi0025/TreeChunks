import React from 'react';
import { Panel, Button } from 'react-bootstrap';

class Trees extends React.Component {

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

  incrementPopularity() {
    adjustPopularity(this.props.tree._id, 1); 
  }

  adjustPopularity(treeId, adjust){
    // e.preventDefault();
    console.log('Im Popular');
    fetch("/adjustTree",{
      method:"PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        treeId: treeId,
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

//What if we take the panel below and move it inot a tree component
// Then we would pass the tree as a prop
//move the methods to a the single (tree) component b/c they're about a single tree
//Up button calls a method "increment popularity" down button calls a method "decrement popularity"
  prepareTrees(){
    return this.state.trees.map(function(tree){
      return(
        <Panel key={tree._id}>
          {tree.title}
          <br/>
          {tree.cover}
          <br/>
          {tree.chunk.content}
          <br/>
          {tree.popularity}
          <br/>
          <Button onClick = {this.incrementPopularity}>Up</Button>
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

Trees.propTypes = {
  content: React.PropTypes.string,
  popularity: React.PropTypes.number
};

export default Trees;
