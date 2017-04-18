import React from 'react';
import { Panel} from 'react-bootstrap';

class Tree extends React.Component {

  constructor() {
    super();
    this.state = {
      trees: []
    };
    this.fetchTrees = this.fetchTrees.bind(this);
    // this.chunkBody = this.chunkBody.bind(this);
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

  // chunkBody(_id){
  //   let content ="";
  //   fetch("/getChunk",{
  //     method:"GET",
  //     headers: {
  //       "Accept": "application/json",
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({
  //       _id: _id,
  //     })
  //   })
  //   .then(result => result.json())
  //   .then(res => {
  //     return res.content;
  //   });
  // }

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