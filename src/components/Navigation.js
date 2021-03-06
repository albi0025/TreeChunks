import React from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Glyphicon, ButtonToolbar, Button } from 'react-bootstrap';
import NewTreeForm from './NewTreeForm';
import AboutModal from './AboutModal';
import { LinkContainer } from 'react-router-bootstrap';
import { Link, hashHistory } from 'react-router';
import GoogleLogin from 'react-google-login';
import { observer, inject } from 'mobx-react';

class Navigation extends React.Component {

  constructor() {
    super();
    this.state = {
      lgShow: false,
      aboutShow: false,
    };
    this.googleLoginHandler = this.googleLoginHandler.bind(this);
    this.lgClose = this.lgClose.bind(this);
    this.lgOpen = this.lgOpen.bind(this);
    this.aboutClose = this.aboutClose.bind(this);
    this.aboutOpen = this.aboutOpen.bind(this);
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

  aboutClose(){
    this.setState({ aboutShow: false });
  }

  aboutOpen(){
    this.setState({ aboutShow: true });
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
          <Navbar .Collapse>
            {
              this.props.userStore.loggedIn
              ?
                <Nav pullRight className="navStyling">
                  <NavItem onClick={this.lgOpen}>
                    Create A New Tree
                  </NavItem>
                  <NavItem> | </NavItem>
                  <NavItem onClick={this.aboutOpen}>
                  About
                  </NavItem>
                  <NavItem> | </NavItem>
                  <NavItem onClick={this.goToDashBoard}>
                    < Glyphicon glyph="user"/> {this.props.userStore.user.name}
                  </NavItem>
                  <NavItem> | </NavItem>
                  <NavItem onClick={this.props.userStore.logout}>Logout</NavItem>
                </Nav>
              : <Nav pullRight>
                  <NavItem onClick={this.aboutOpen}>
                  About
                  </NavItem>
                  <GoogleLogin
                    clientId="982750667675-79rf5cojorslnijhsb7e701ltq61k74n.apps.googleusercontent.com"
                    className="googlebtn"
                    onSuccess={this.googleLoginHandler}
                    onFailure={this.googleLoginHandler}>
                    <img src="/images/btn_google_signin.png"/>
                  </GoogleLogin>
                </Nav>
            }
          </Navbar .Collapse>
        </Navbar>
        <NewTreeForm show={this.state.lgShow} onHide={this.lgClose} />
        <AboutModal show={this.state.aboutShow} onHide={this.aboutClose} />
        {this.props.children}
      </div>
    );}
}

Navigation.propTypes = {
  children: React.PropTypes.object,
  userStore: React.PropTypes.object
};

export default inject("userStore")(observer(Navigation));
