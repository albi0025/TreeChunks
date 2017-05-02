import React from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { hashHistory } from 'react-router';


class AboutModal extends React.Component {

  constructor() {
    super();
    this.state = {
      content: ""
    };
  }

  render() {
    return (
      <Modal {...this.props} aria-labelledby="contained-modal-title-sm">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg card-text">About</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{margin: "50px"}}>
          <img className="image-fluid" src="/images/aboutModal.png" style={{maxWidth: "100%", height: "auto"}}/>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

AboutModal.propTypes = {
  onHide: React.PropTypes.func,
};

export default AboutModal;
