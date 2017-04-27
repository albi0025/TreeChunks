import React from 'react';
import Tree from './Tree';
import { observer, inject } from 'mobx-react';



class UserDashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      followedtrees: [],
      createdtrees: []
    };
    this.fetchFollowedTrees = this.fetchFollowedTrees.bind(this);
    this.fetchCreatedTrees = this.fetchCreatedTrees.bind(this);
  }

  componentWillMount(){
    this.fetchFollowedTrees();
    this.fetchCreatedTrees();
  }

  prepareTrees(treelist){
    return this.state[treelist].map(function(tree){
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
        followedtrees: res
      });
    });
  }

  fetchCreatedTrees(){
    fetch("/fetchCreatedTrees/"+ this.props.userStore.user._id,{
      method:"GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    })
    .then(result => result.json())
    .then(res => {
      this.setState({
        createdtrees: res
      });
    });
  }

  render() {
    return (
      <div className="dashboard-content container-fluid">
        <div>
        {(this.state.followedtrees)
        ? this.prepareTrees("followedtrees")
        : ""}
        </div>
        <div>
        {(this.state.createdtrees)
        ? this.prepareTrees("createdtrees")
        : ""}
        </div>
      </div>
    );
  }
}

UserDashboard.propTypes = {
  userStore: React.PropTypes.object
};

export default inject("userStore")(observer(UserDashboard));
