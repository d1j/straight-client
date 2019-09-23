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
      gameCountFirst: "",
      gameCountSecond: "",
      gameCount: "", //how many games a user has played

      lobbyID: null,
      lobbyData: {},

      message: "",

      loading: true,

      view: 0 //0 - main screen//1 - join lobby//2 - create lobby//3 - lobby//
    };

    this.chooseLobby = this.chooseLobby.bind(this);
    this.joinLobby = this.joinLobby.bind(this);
    this.createLoby = this.createLoby.bind(this);
    this.logout = this.logout.bind(this);
    this.setView = this.setView.bind(this);
  }

  /**
   * |0 - MainMenu|1 - ChooseLobby|2 - CreateLobby|3 - Lobby|
   *
   */
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
          gameCountFirst: res.data.first,
          gameCountSecond: res.data.second,
          gameCount: res.data.played,
          loading: false
        });
      })
      .catch(err => {
        //TODO: error handling
        self.setState({
          message: "Error occured while gathering user statistics"
        });
        console.log(err);
      });
  }

  chooseLobby() {
    this.setView(1);
  }

  joinLobby(lobbyID, lobbyPassword) {
    let self = this;
    this.setState({ loading: true });
    axios
      .post(`${self.props.host}/lobby/join`, {
        lobby_id: lobbyID,
        lobby_password: lobbyPassword,
        token: self.props.__token
      })
      .then(res => {
        self.setState({
          loading: false,
          lobbyID: lobbyID,
          lobbyData: res.data,
          view: 3
        });
      })
      .catch(err => {
        console.log(err);
        self.setState({
          message: "Error occured while joining the lobby",
          loading: false
        });
      });
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
        //TODO: error handling
        console.log(err);
        self.props.setView(0);
      });
  }

  render() {
    if (this.state.loading) {
      return (
        <div>
          <p>Loading... MainScreen</p>
          <p style={{ color: "red" }}>{this.state.message}</p>
        </div>
      );
    } else {
      switch (this.state.view) {
        case 0:
          return (
            <div>
              <p> Logged in as: {this.state.username}</p>
              <p> Games played: {this.state.gameCount}</p>
              <p> Won games: {this.state.gameCountFirst}</p>
              <p> Placed second: {this.state.gameCountSecond}</p>
              <div>
                <Button onClick={this.chooseLobby}>Find loby</Button>
                <Button onClick={this.createLoby}>Create loby</Button>
                {/*TODO: Protect from spam*/}
                <Button onClick={this.logout}>Log out</Button>
              </div>
              <p style={{ color: "red" }}>{this.state.message}</p>
            </div>
          );
        case 1:
          return (
            <ChooseLobby
              __token={this.props.__token}
              setView={this.setView}
              host={this.props.host}
              joinLobby={this.joinLobby}
            />
          );
        case 2:
          return (
            <CreateLobby
              __token={this.props.__token}
              setView={this.setView}
              username={this.state.username}
              host={this.props.host}
              joinLobby={this.joinLobby}
            />
          );
        case 3:
          return (
            <Lobby
              __token={this.props.__token}
              __dev={this.props.__dev}
              setView={this.setView}
              host={this.props.host}
              data={this.state.lobbyData}
              lobbyID={this.state.lobbyID}
            />
          );
        default:
          return <h1>You are not supposed to be here...</h1>;
      }
    }
  }
}

export default MainMenu;
