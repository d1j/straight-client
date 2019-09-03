import React, { Component } from "react";
import {
  Form,
  FormGroup,
  FormLabel,
  FormControl,
  Button
} from "react-bootstrap";
import axios from "axios";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      message: "",

      _min_pass_length: 6, //Leaving it to 6 while developing the application.
      _max_pass_length: 128,
      _min_user_length: 3,
      _max_user_length: 32
    };
    this.homeView = this.homeView.bind(this);
    this.mainScreenView = this.mainScreenView.bind(this);
    this.processLogin = this.processLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }

  mainScreenView() {
    this.props.setView(3);
  }

  homeView() {
    this.props.setView(0);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value, message: "" });
  }

  validateForm() {
    let err = "";
    let { username, password } = this.state,
      {
        _max_pass_length,
        _min_pass_length,
        _max_user_length,
        _min_user_length
      } = this.state;

    if (username.length < _min_user_length) {
      err = `Username is too short. Min ${_min_user_length} characters.`;
    } else if (username.length > _max_user_length) {
      err = `Username is too long. Max ${_max_pass_length} characters.`;
    } else if (password.length < _min_pass_length) {
      err = `Password is too short. Min ${_min_pass_length} characters.`;
    } else if (password.length > _max_pass_length) {
      err = `Password is too long. Max ${_max_pass_length} characters.`;
    }

    this.setState({ message: err });

    return err === "";
  }

  processLogin(event) {
    event.preventDefault();
    var self = this;
    if (this.validateForm()) {
      //credentials meet requirements
      axios
        .post(`${self.props.host}/account/login`, {
          username: self.state.username,
          password: self.state.password
        })
        .then(res => {
          //registration succeded
          //BUILD: clean up
          if (self.props.__dev) {
            self.props.__setToken(res.data.token);
          }
          self.mainScreenView();
        })
        .catch(err => {
          if (!err.response) {
            // network error
            self.setState({
              message: "Unable to reach server. Try again later."
            });
          } else {
            self.setState({
              message: err.response.data.message
            });
          }
        });
    }
  }

  render() {
    return (
      <div>
        <p>123456789</p>
        <Form onSubmit={this.processLogin}>
          <FormGroup>
            <FormLabel>Username</FormLabel>
            <FormControl
              type="text"
              placeholder="Enter username"
              name="username"
              onChange={this.handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>Password</FormLabel>
            <FormControl
              type="password"
              placeholder="Enter password"
              name="password"
              onChange={this.handleChange}
              required
            />
          </FormGroup>

          <p style={{ color: "red" }}>{this.state.message}</p>

          <Button variant="primary" type="submit">
            Login
          </Button>
          <Button variant="secondary" onClick={this.homeView}>
            Back
          </Button>
        </Form>
      </div>
    );
  }
}

export default Login;
