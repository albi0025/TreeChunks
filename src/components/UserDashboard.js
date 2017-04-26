import React from 'react';
import Tree from './Tree';
import { observer, inject } from 'mobx-react';



class UserDashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      trees: []
    };
    this.fetchFollowedTrees = this.fetchFollowedTrees.bind(this);
  }

  componentWillMount(){
    this.fetchFollowedTrees();
  }

  prepareTrees(){
    return this.state.trees.map(function(tree){
      return(
        <Tree key={tree._id} tree={tree}/>
      );
    },this);
  }

  fetchFollowedTrees(){
    fetch("/fetchFollowedTrees/"+ this.props.userStore.user._id,{
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

  render() {
    let trees = this.prepareTrees();

    return (
      <div>
        {trees}
      </div>
    );
  }
}

UserDashboard.propTypes = {
  content: React.PropTypes.string,
  popularity: React.PropTypes.number,
  userStore: React.PropTypes.object
};

export default inject("userStore")(observer(UserDashboard));
