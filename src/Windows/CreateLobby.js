import React, { Component } from "react";
import {
  Form,
  FormGroup,
  FormLabel,
  FormControl,
  Button
} from "react-bootstrap";
import axios from "axios";

class CreateLobby extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lobby_name: this.props.username + "'s lobby",
      lobby_password: "",
      lobby_id: null,

      message: ""
    };

    this.processLobbyCreation = this.processLobbyCreation.bind(this);
    this.mainScreenView = this.mainScreenView.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.lobbyView = this.lobbyView.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value, message: "" });
  }

  processLobbyCreation(event) {
    event.preventDefault();
  }

  mainScreenView() {
    this.props.setView(0);
  }

  lobbyView() {
    let self = this;
    axios
      .post(`${self.props.host}/lobby/create`, {
        token: self.props.__token,
        lobby_password: self.state.lobby_password,
        lobby_name: self.state.lobby_name
      })
      .then(res => {
        self.props.joinLobby({
          lobby_id: res.data.lobby_id
        });
      })
      .catch(err => {
        if (!err.response) {
          // network error
          self.setState({
            message: "Unable to reach server. Try again later."
          });
        } else {
          self.setState({
            message: "Unable to create new lobby. Try again later"
          });
        }
      });
  }

  render() {
    return (
      <div>
        <h1> Create Lobby </h1>
        <Form onSubmit={this.processLobbyCreation}>
          <FormGroup>
            <FormLabel>Lobby name</FormLabel>
            <FormControl
              type="text"
              placeholder={this.state.lobby_name}
              name="lobby_name"
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>Password</FormLabel>
            <FormControl
              type="text"
              placeholder="Enter lobby password"
              name="lobby_password"
              onChange={this.handleChange}
              required
            />
          </FormGroup>

          <p style={{ color: "red" }}>{this.state.message}</p>

          <Button variant="primary" type="submit">
            Create
          </Button>
          <Button variant="secondary" onClick={this.mainScreenView}>
            Back
          </Button>
        </Form>
        <p style={{ color: "red" }}>{this.state.message}</p>
      </div>
    );
  }
}

export default CreateLobby;
