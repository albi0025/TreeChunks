import React from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router';



class Navigation extends React.Component {

  constructor() {
    super();
  }

  render(){
    return(
      <div>
        <Navbar inverse>
          <Link  to= {{pathname: '/trees'}}><h2>Home</h2></Link>
        </Navbar>
        {this.props.children}
      </div>
    );}
}

Navigation.propTypes = {
  children: React.PropTypes.object
};

export default Navigation;
