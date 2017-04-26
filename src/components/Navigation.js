import React from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Glyphicon, ButtonToolbar, Button } from 'react-bootstrap';
import NewTreeForm from './NewTreeForm';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router';
import GoogleLogin from 'react-google-login';
import { observer, inject } from 'mobx-react';

class Navigation extends React.Component {

  constructor() {
    super();
    this.state = {
      lgShow: false,
    };
    this.googleLoginHandler = this.googleLoginHandler.bind(this);
  }

  componentDidMount() {
    if(this.props.userStore.loggedIn){
      this.props.userStore.getUser();
    }
  }

  googleLoginHandler(response) {
    this.props.userStore.saveToken(response);
  }

  render(){
    let lgClose = () => this.setState({ lgShow: false });
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
          <Nav pullRight>
            <NavItem>
            {
              this.props.userStore.loggedIn
              ? <Button onClick={()=> {
                this.setState({ lgShow: true });
              }}>
                Create A New Tree
                </Button>
              : ""
            }
            </NavItem>
            <NavItem>
            {
              this.props.userStore.loggedIn
              ?<Button className="user-dashboard-link" href="/UserDashboard">
                <Link to={{ pathname: '/UserDashboard' }}>Dashboard</Link>
              </Button>
              :""
            }
            </NavItem>
            <NavItem>
              <ButtonToolbar>
                <NewTreeForm show={this.state.lgShow} onHide={lgClose} />
              </ButtonToolbar>
              {
                this.props.userStore.loggedIn
                ? <Button onClick={this.props.userStore.logout} className="navButton" bsStyle="primary">Logout</Button>
                : <GoogleLogin
                  clientId="982750667675-79rf5cojorslnijhsb7e701ltq61k74n.apps.googleusercontent.com"
                  className="googlebtn"
                  onSuccess={this.googleLoginHandler}
                  onFailure={this.googleLoginHandler}>
                  <span> Login with Google</span>
                </GoogleLogin>
             }
            </NavItem>
          </Nav>
          </Navbar .Collapse>
        </Navbar>
        {this.props.children}
      </div>
    );}
}

Navigation.propTypes = {
  children: React.PropTypes.object,
  userStore: React.PropTypes.object
};

export default inject("userStore")(observer(Navigation));
