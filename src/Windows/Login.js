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
      email: "",
      password: "",
      message: "",

      _min_pass_length: 6, //Leaving it to 6 while developing the application.
      _max_pass_length: 128,
      _min_email_length: 3,
      _max_email_length: 64,

      disabledButton: false
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
    let { email, password } = this.state,
      {
        _max_pass_length,
        _min_pass_length,
        _max_email_length,
        _min_email_length
      } = this.state;

    if (email.length < _min_email_length) {
      err = `Email is too short. Min ${_min_email_length} characters.`;
    } else if (email.length > _max_email_length) {
      err = `Email is too long. Max ${_max_email_length} characters.`;
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

    this.setState({ disabledButton: true }, () => {
      if (this.validateForm()) {
        //credentials meet requirements
        axios
          .post(`${self.props.host}/account/login`, {
            email: self.state.email,
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
            console.log(err);
            self.setState({
              message: "An error ocurred while logging in",
              disabledButton: false
            });
          });
      } else {
        self.setState({ disabledButton: false });
      }
    });
  }

  render() {
    return (
      <div>
        <Form onSubmit={this.processLogin}>
          <FormGroup>
            <FormLabel>Email</FormLabel>
            <FormControl
              type="text"
              placeholder="Enter email"
              value={this.state.email}
              name="email"
              onChange={this.handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>Password</FormLabel>
            <FormControl
              type="password"
              placeholder="Enter password"
              value={this.state.password}
              name="password"
              onChange={this.handleChange}
              required
            />
          </FormGroup>

          <p style={{ color: "red" }}>{this.state.message}</p>

          <Button
            variant="primary"
            type="submit"
            disabled={this.state.disabledButton}
          >
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
