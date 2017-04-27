import React from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Glyphicon, ButtonToolbar, Button } from 'react-bootstrap';
import NewTreeForm from './NewTreeForm';
import { LinkContainer } from 'react-router-bootstrap';
import { Link, hashHistory } from 'react-router';
import GoogleLogin from 'react-google-login';
import { observer, inject } from 'mobx-react';

class Navigation extends React.Component {

  constructor() {
    super();
    this.state = {
      lgShow: false,
    };
    this.googleLoginHandler = this.googleLoginHandler.bind(this);
    this.lgClose = this.lgClose.bind(this);
    this.lgOpen = this.lgOpen.bind(this);
  }

  componentDidMount() {
    if(this.props.userStore.loggedIn){
      this.props.userStore.getUser();
    } else{
      hashHistory.push('/');
    }
  }

  googleLoginHandler(response) {
    this.props.userStore.saveToken(response);
  }

  lgClose(){
    this.setState({ lgShow: false });
  }

  lgOpen(){
    this.setState({ lgShow: true });
  }

  goToDashBoard(){
    hashHistory.push("/UserDashboard");
  }

  render(){
    return(
      <div>
        <Navbar className="logo" fluid>
          <Navbar .Header>
            <Navbar .Brand>
              <Link  to= {{pathname: '/trees'}}><img src="/images/treechunklogo2.png" width="150"/></Link>
            </Navbar .Brand>
          <Navbar .Toggle />
          </Navbar .Header>
          <Navbar .Collapse> {/*Header Toggle and Collapse will make our menu responsive to small screens*/}
            {
              this.props.userStore.loggedIn
              ? <Nav pullRight>
                <NavItem onClick={this.lgOpen}>
                Create A New Tree
                </NavItem>
                <NavItem onClick={this.goToDashBoard}>
                  <Glyphicon glyph="user"/> {this.props.userStore.user.name}
                </NavItem>
                <NavItem onClick={this.props.userStore.logout}>Logout</NavItem>
                </Nav>
              : <Nav pullRight>
                  <GoogleLogin
                    clientId="982750667675-79rf5cojorslnijhsb7e701ltq61k74n.apps.googleusercontent.com"
                    className="googlebtn"
                    onSuccess={this.googleLoginHandler}
                    onFailure={this.googleLoginHandler}>
                    <span> Login with Google</span>
                  </GoogleLogin>
                </Nav>
            }
          </Navbar .Collapse>
        </Navbar>
        <NewTreeForm show={this.state.lgShow} onHide={this.lgClose} />
        {this.props.children}
      </div>
    );}
}

Navigation.propTypes = {
  children: React.PropTypes.object,
  userStore: React.PropTypes.object
};

export default inject("userStore")(observer(Navigation));
