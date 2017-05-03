import React from 'react';
import { Button, Col, Row, Thumbnail, Grid, Pager, DropdownButton, MenuItem } from 'react-bootstrap';
import { observer, inject } from 'mobx-react';
import Trees from './Trees';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      offset: 0,
      numberoftrees: null,
      sortby: "popularity",
      sortdirection: "descending"
    };

    this.pageDownHandler = this.pageDownHandler.bind(this);
    this.pageUpHandler = this.pageUpHandler.bind(this);
    this.fetchTreeCount = this.fetchTreeCount.bind(this);
    this.setSortToDate = this.setSortToDate.bind(this);
    this.setSortToTitle = this.setSortToTitle.bind(this);
    this.setSortToPopularity = this.setSortToPopularity.bind(this);
    this.setSortToAscending = this.setSortToAscending.bind(this);
    this.setSortToDescending = this.setSortToDescending.bind(this);
    this.setSortToAuthor = this.setSortToAuthor.bind(this);
  }

  componentWillMount(){
    this.fetchTreeCount();
  }

  componentWillUpdate(){
    if(this.state.offset !== 0){
      this.setState({
        offset: 0
      });
    }
  }

  pageDownHandler(){
    this.setState({
      offset: this.state.offset-10
    });
    window.scrollTo(0, 0);
  }

  pageUpHandler(){
    this.setState({
      offset: this.state.offset+10
    });
    window.scrollTo(0, 0);
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

  setSortToDate(){
    this.setState({
      offset: 0,
      sortby: "date"
    });
  }

  setSortToAuthor(){
    this.setState({
      offset: 0,
      sortby: "author"
    });
  }

  setSortToPopularity(){
    this.setState({
      offset: 0,
      sortby: "popularity"
    });
  }

  setSortToTitle(){
    this.setState({
      offset: 0,
      sortby: "title"
    });
  }

  setSortToAscending(){
    this.setState({
      offset: 0,
      sortdirection: "ascending"
    });
  }

  setSortToDescending(){
    this.setState({
      offset: 0,
      sortdirection: "descending"
    });
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
        <div className="sort-dropdown">
          <DropdownButton title={"Sort By: "+ this.state.sortby} id="sortby">
            <MenuItem onClick={this.setSortToPopularity}>Popularity</MenuItem>
            <MenuItem onClick={this.setSortToDate}>Date Added</MenuItem>
            <MenuItem onClick={this.setSortToTitle}>Title</MenuItem>
            <MenuItem onClick={this.setSortToAuthor}>Author</MenuItem>
          </DropdownButton>
          <DropdownButton title={"Sort Order: "+ this.state.sortdirection} id="sortdirection">
            <MenuItem onClick={this.setSortToDescending}>Descending</MenuItem>
            <MenuItem onClick={this.setSortToAscending}>Ascending</MenuItem>
          </DropdownButton>
        </div>
        <div className="tree-list-content container-fluid">
          <Trees sortdirection={this.state.sortdirection} offset={this.state.offset} sortby={this.state.sortby}/>
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
