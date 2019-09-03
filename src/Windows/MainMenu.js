import React, { Component } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import CreateLobby from "./CreateLobby";
import ChooseLobby from "./ChooseLobby";
import Lobby from "./Lobby";

class MainMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      game_count_first: "",
      game_count_second: "",

      lobby_id: null,

      message: "",

      loading: true,

      view: 0 //0 - main screen//1 - join lobby//2 - create lobby//
    };

    this.chooseLobby = this.chooseLobby.bind(this);
    this.joinLoby = this.joinLoby.bind(this);
    this.createLoby = this.createLoby.bind(this);
    this.logout = this.logout.bind(this);
    this.setView = this.setView.bind(this);
  }

  setView(view) {
    this.setState({ view: view });
  }

  //TODO: improve error handling
  //BUILD: modify request
  componentDidMount() {
    let self = this;
    axios
      .post(`${self.props.host}/account/stats`, {
        token: self.props.__token
      })
      .then(res => {
        self.setState({
          username: res.data.user,
          game_count_first: res.data.first,
          game_count_second: res.data.second,
          loading: false
        });
      })
      .catch(err => {
        if (!err.response) {
          // network error
          self.setState({
            message: "Unable to reach server. Try again later."
          });
        } else {
          console.log(err.response);
          self.setState({
            username: "error ocurred",
            game_count_first: "while loading",
            game_count_second: "stats",
            loading: false
          });
        }
      });
  }

  chooseLobby() {
    this.setView(1);
  }

  joinLoby() {
    //to be implemented
  }

  createLoby() {
    this.setView(2);
  }

  //TODO: improve error handling
  //BUILD: modify request
  logout() {
    let self = this;

    axios
      .post(`${self.props.host}/account/logout`, {
        token: self.props.__token
      })
      .then(res => {
        self.props.setView(0);
      })
      .catch(err => {
        if (!err.response) {
          // network error
          self.setState({
            message: "Unable to reach server. Try again later."
          });
        }
        self.props.setView(0);
      });
  }

  render() {
    if (this.state.loading) {
      return (
        <div>
          <p>Loading...</p>
          <p style={{ color: "red" }}>{this.state.message}</p>
        </div>
      );
    } else {
      switch (this.state.view) {
        case 0:
          return (
            <div>
              <p> Logged in as: {this.state.username}</p>
              <p> Won games: {this.state.game_count_first}</p>
              <p> Placed second: {this.state.game_count_second}</p>
              <div>
                <Button onClick={this.chooseLobby}>Find loby</Button>
                <Button onClick={this.createLoby}>Create loby</Button>
                <Button onClick={this.logout}>Log out</Button>
              </div>
              <p style={{ color: "red" }}>{this.state.message}</p>
            </div>
          );
        case 1:
          return <ChooseLobby />;
        case 2:
          return (
            <CreateLobby
              __token={this.props.__token}
              setView={this.setView}
              username={this.state.username}
              host={this.props.host}
            />
          );
        case 3:
          return <Lobby />;
        default:
          return <h1>You are not supposed to be here...</h1>;
      }
    }
  }
}

export default MainMenu;
