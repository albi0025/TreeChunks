import React from 'react';
import { Panel, Button } from 'react-bootstrap';


class Story extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tree: {}
    };
    this.fetchTree = this.fetchTree.bind(this);
  }

  componentWillMount(){
    this.fetchTree();
  }

  fetchTree(){
    fetch("/getTree/" + this.props.params.treeId, {
      method:"GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    })
    .then(result => result.json())
    .then(res => {
      this.setState({
        tree: res
      });
    });
  }


  render() {
    console.log(this.state.tree);
    return (<Panel key={this.state.tree._id}>
      {this.state.tree.title}
      <br/>
      {this.state.tree.cover}
      <br/>
      {this.state.tree.chunk[0].content}
      <br/>
      {this.state.tree.popularity}
    </Panel>
    );
  }
}

Story.propTypes = {
  params: React.PropTypes.object
};

export default Story;
