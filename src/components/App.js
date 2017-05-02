import React from 'react';
import { Button, Col, Row, Thumbnail, Grid } from 'react-bootstrap';
import { observer, inject } from 'mobx-react';
import Trees from './Trees';

class App extends React.Component {

  constructor() {
    super();
  }

  render() {
    return (
      <div>
       <div className="header-text container-fluid text-center">
        {this.props.userStore.loggedIn
        ? <img className ="img-fluid" src="/images/welcomeonly.png" style={{maxWidth: "100%", height: "auto"}}/>
        : <img className ="img-fluid" src="/images/headertext.png" style={{maxWidth: "100%", height: "auto"}} />
        }
        </div>
        <div className="tree-list-content container-fluid">
          <Trees />
        </div>
      </div>
    );
  }
}

App.propTypes = {
  userStore: React.PropTypes.object
};

export default inject("userStore")(observer(App));
