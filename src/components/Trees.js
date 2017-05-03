import React from 'react';
import Tree from './Tree';

class Trees extends React.Component {

  constructor() {
    super();
    this.state = {
      trees: []
    };
    this.fetchTrees = this.fetchTrees.bind(this);
  }

  componentWillMount(){
    this.fetchTrees(this.props.offset);
  }

  componentWillReceiveProps(nextProps){
    this.fetchTrees(nextProps.offset);
  }

  fetchTrees(offset){
    fetch("/getTrees/"+offset,{
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
          <Tree key={tree._id} tree={tree} style={{ fontFamily: "'Walter Turncoat', cursive"}}/>
      );
    },this);
  }


  render() {
    return (
      <div>
        {this.prepareTrees()}
      </div>
    );
  }
}

Trees.propTypes = {
  content: React.PropTypes.string,
  popularity: React.PropTypes.number,
  offset: React.PropTypes.number
};

export default Trees;
