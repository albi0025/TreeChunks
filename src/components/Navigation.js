import React from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Glyphicon, ButtonToolbar, Button } from 'react-bootstrap';
import NewTreeForm from './NewTreeForm';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router';



class Navigation extends React.Component {

  constructor() {
    super();
    this.state = {
      lgShow: false
    };
  }

  render(){
    let lgClose = () => this.setState({ lgShow: false });
    return(
      <div>
        <Navbar className="logo" fluid>
          <Navbar .Brand>
            <Link  to= {{pathname: '/trees'}}><img src="/images/treechunklogo2.png" width="150"/></Link>
          </Navbar .Brand>
          <Nav pullRight>
            <NavItem>
              <Button onClick={()=> {
                this.setState({ lgShow: true });
              }}>
                Create A New Tree
              </Button>
            </NavItem>
            <NavItem>
              <ButtonToolbar>
                <NewTreeForm show={this.state.lgShow} onHide={lgClose} />
              </ButtonToolbar>
            </NavItem>
          </Nav>
        </Navbar>
        {this.props.children}
      </div>
    );}
}

Navigation.propTypes = {
  children: React.PropTypes.object
};

export default Navigation;
