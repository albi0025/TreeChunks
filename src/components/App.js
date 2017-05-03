import React from 'react';
import { Button, Col, Row, Thumbnail, Grid, Pager } from 'react-bootstrap';
import { observer, inject } from 'mobx-react';
import Trees from './Trees';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      offset: 0,
      numberoftrees: null
    };

    this.pageDownHandler = this.pageDownHandler.bind(this);
    this.pageUpHandler = this.pageUpHandler.bind(this);
    this.fetchTreeCount = this.fetchTreeCount.bind(this);
  }

  componentWillMount(){
    this.fetchTreeCount();
  }

  pageDownHandler(){
    this.setState({
      offset: this.state.offset-10
    });
  }

  pageUpHandler(){
    this.setState({
      offset: this.state.offset+10
    });
  }

  fetchTreeCount(chunkId, story){
    fetch("/getTreeCount/", {
      method:"GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    })
    .then(result => result.json())
    .then(data => this.setState({numberoftrees: data}));
  }

  render() {
    return (
      <div>
       <div className="header-text container-fluid text-center">
        {this.props.userStore.loggedIn
        ? <img className ="img-fluid" src="/images/welcomeonly.png" style={{maxWidth: "60%", height: "auto"}}/>
        : <img className ="img-fluid" src="/images/headertext.png" style={{maxWidth: "70%", height: "auto"}} />
        }
        </div>
        <div className="tree-list-content container-fluid">
          <Trees offset={this.state.offset}/>
        </div>
        <Pager>
          {
            (this.state.offset !== 0)
            ?<Pager.Item onClick={this.pageDownHandler}>Previous</Pager.Item>
            :""
          }
          {' '}
          {
            (this.state.offset+10 < this.state.numberoftrees)
            ?<Pager.Item onClick={this.pageUpHandler}>Next</Pager.Item>
            :""
          }
        </Pager>
        <br/>
      </div>
    );
  }
}

App.propTypes = {
  userStore: React.PropTypes.object
};

export default inject("userStore")(observer(App));
