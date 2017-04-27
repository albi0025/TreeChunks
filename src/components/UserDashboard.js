import React from 'react';
import DashboardTree from './DashboardTree';
import { Col } from 'react-bootstrap';
import { observer, inject } from 'mobx-react';



class UserDashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      followedtrees: [],
      createdtrees: []
    };
    this.prepareCreatedTrees = this.prepareCreatedTrees.bind(this);
    this.prepareFollowedTrees = this.prepareFollowedTrees.bind(this);
    this.fetchFollowedTrees = this.fetchFollowedTrees.bind(this);
    this.fetchCreatedTrees = this.fetchCreatedTrees.bind(this);
  }

  componentWillMount(){
    this.fetchFollowedTrees();
    this.fetchCreatedTrees();
  }

  prepareFollowedTrees(){
    return this.state.followedtrees.map(function(tree){
      return(
        <DashboardTree key={tree._id} tree={tree}/>
      );
    },this);
  }

  prepareCreatedTrees(){
    return this.state.createdtrees.map(function(tree){
      return(
        <DashboardTree key={tree._id} tree={tree}/>
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
    let followedTrees;
    let createdTrees;
    this.state.followedtrees
    ? followedTrees = this.prepareFollowedTrees()
    : "";
    this.state.createdtrees
    ? createdTrees = this.prepareCreatedTrees()
    : "";

    return (
      <div className="dashboard-content container-fluid">
        <Col xs={12} md={5}>

        <h3 style={{textAlign: "center"}}>Trees you started</h3>
        <div className="flexy">
        {createdTrees}
        </div>
        </Col>
        <Col xs={0} md={2}/>
        <Col xs={12} md={5}>
        <h3 style={{textAlign: "center"}}>Your followed trees</h3>
        <div className="flexy">
        {followedTrees}
        </div>
        </Col>
      </div>
    );
  }
}

UserDashboard.propTypes = {
  userStore: React.PropTypes.object
};

export default inject("userStore")(observer(UserDashboard));
