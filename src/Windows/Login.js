import React, { Component } from "react";
import {
  Form,
  FormGroup,
  FormLabel,
  FormControl,
  Button
} from "react-bootstrap";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.backView = this.backView.bind(this);
    this.processLogin = this.processLogin.bind(this);
  }

  backView() {
    this.props.setView(0);
  }

  processLogin() {
    //TODO: Send request to server and log in the user
  }

  render() {
    return (
      <div>
        <Form>
          <FormGroup>
            <FormLabel>Username</FormLabel>
            <FormControl type="username" placeholder="Enter username" />
          </FormGroup>
          <FormGroup>
            <FormLabel>Password</FormLabel>
            <FormControl type="password" placeholder="Enter password" />
          </FormGroup>
          <Button variant="primary" onClick={this.processLogin}>
            Login
          </Button>
          <Button variant="secondary" onClick={this.backView}>
            Back
          </Button>
        </Form>
      </div>
    );
  }
}

export default Login;
