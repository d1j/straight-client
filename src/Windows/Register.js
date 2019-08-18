import React, { Component } from "react";
import {
  Form,
  FormGroup,
  FormLabel,
  FormControl,
  FormText,
  Button
} from "react-bootstrap";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.backView = this.backView.bind(this);
    this.processRegister = this.processRegister.bind(this);
  }

  backView() {
    this.props.setView(0);
  }

  processRegister() {
    //TODO: Check if Data is correct
  }

  render() {
    return (
      <div>
        <Form>
          <FormGroup>
            <FormLabel>Email Address</FormLabel>
            <FormControl type="email" placeholder="Enter email" />
          </FormGroup>
          <FormGroup>
            <FormLabel>Username</FormLabel>
            <FormControl type="username" placeholder="Enter username" />
            <FormText className="text-muted">
              The username will be displayed in-game
            </FormText>
          </FormGroup>
          <FormGroup>
            <FormLabel>
              <FormLabel>Password</FormLabel>
              <FormControl type="password" placeholder="Enter password" />
            </FormLabel>
            <FormLabel>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl type="password" placeholder="Re-Enter password" />
            </FormLabel>
          </FormGroup>
          <Button variant="primary" onClick={this.processRegister}>
            Register
          </Button>
          <Button variant="secondary" onClick={this.backView}>
            Back
          </Button>
        </Form>
      </div>
    );
  }
}

export default Register;
