import React from 'react';
import { Panel, Button } from 'react-bootstrap';
import Tree from './Tree';
import { Link } from 'react-router';

class Trees extends React.Component {

  constructor() {
    super();
    this.state = {
      trees: []
    };
    this.fetchTrees = this.fetchTrees.bind(this);
  }

  componentWillMount(){
    this.fetchTrees();
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
        <Link key={tree._id} to= {{pathname: '/Story/' + tree._id}}><Tree key={tree._id} tree={tree}/></Link>
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
