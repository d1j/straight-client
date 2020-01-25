import React, { Component } from "react";
import socketIOClient from "socket.io-client";

import Game from "./Game";

class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHost: false,
      playerID: null,

      loading: true,
      message: "",
      data: this.props.data,
      view: 0 //0 - Lobby//1 - Game//
    };

    this.socket = socketIOClient(this.props.host, {
      query: { token: this.props.__token, lobby: this.props.lobbyID }
    });

    //On successful connection client emits 'join-lobby' to the server
    this.socket.on("connect", () => {
      if (this.props.__dev) console.log("(SOCKET.IO) Connected to the server.");
      if (this.props.__dev) console.log("(SOCKET.IO) Joining the lobby...");
      this.socket.emit("join-lobby");
      this.setState({ loading: false });
    });

    this.socket.on("joined-lobby", () => {
      if (this.props.__dev) {
        console.log("(SOCKET.IO) joined-lobby");
      }
      this.setState({ loading: false });
    });

    this.socket.on("new-player-in-lobby", data => {
      if (this.props.__dev) {
        console.log("(SOCKET.IO) new-player-in-lobby");
        console.log(data);
      }
      this.state.data.players.push(data);
      this.forceUpdate();
    });

    this.socket.on("player-left", data => {
      if (this.props.__dev) {
        console.log("(SOCKET.IO) player-left");
        console.log(data);
      } //data = {leftPlayerID, newHostID}
      let players = this.state.data.players;
      //remove player
      let leftIndex = players.map(p => p.player_id).indexOf(data.leftPlayerID);
      this.state.data.players.splice(leftIndex, 1);

      if (+data.newHostID !== -1) {
        //set new host in players array
        let newHostIndex = players
          .map(p => p.player_id)
          .indexOf(data.newHostID);
        this.state.data.players[newHostIndex].isHost = true;
      }

      //If user is a new host
      if (+data.newHostID === this.state.playerID) {
        this.state.isHost = true;
      }
      this.forceUpdate();
    });

    this.socket.on("game-is-starting", () => {
      if (this.props.__dev) console.log("(SOCKET.IO) game-is-starting");
      this.setState({ view: 1 });
    });

    this.socket.on("lobby-info", _data => {
      if (this.props.__dev) {
        console.log("(SOCKET.IO) lobby-info");
        console.log(_data);
      }
      this.setState({ data: _data });
    });

    this.renderTable = this.renderTable.bind(this);
    this.renderButtonMenu = this.renderButtonMenu.bind(this);
    this.startGame = this.startGame.bind(this);
    this.leaveLobby = this.leaveLobby.bind(this);
    this.setView = this.setView.bind(this);
  }

  componentDidMount() {
    let players = this.state.data.players;
    for (let i = 0; i < players.length; i++) {
      if (players[i].isUser) {
        this.setState({ isHost: players[i].isHost, playerID: i });
        break;
      }
    }
  }

  setView(_view) {
    this.setState({ view: _view }, () => {
      if (_view == 0) {
        this.socket.emit("get-lobby-info");
      }
    });
  }

  leaveLobby() {
    if (this.props.__dev) console.log("(SOCKET.IO) Leaving lobby...");
    this.socket.emit("leave-lobby");
    if (this.props.__dev) console.log("(SOCKET.IO) Disconnecting.");
    this.socket.disconnect();
    this.props.setView(0);
  }

  startGame() {
    this.socket.emit("host-starts-game");
  }

  renderTable() {
    return (
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Username</th>
            <th>Played games</th>
            <th>Won games</th>
            <th>Placed second</th>
            <th>Is Host?</th>
            <th>Is User?</th>
          </tr>
        </thead>
        <tbody>
          {this.state.data.players.map((user, index) => {
            return (
              <tr key={index}>
                <th>{user.player_id}</th>
                <th>{user._id.username}</th>
                <th>{user._id.playedGames}</th>
                <th>{user._id.wonGames.first}</th>
                <th>{user._id.wonGames.second}</th>
                <th>{user.isHost ? "Yes" : "No"}</th>
                <th>{user.isUser ? "Yes" : "No"}</th>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  renderButtonMenu() {
    return (
      <div>
        <button onClick={this.leaveLobby}>Leave</button>
        {this.state.isHost && <button onClick={this.startGame}>Start</button>}
      </div>
    );
  }

  render() {
    if (this.state.loading) {
      return (
        <div>
          <p>Loading... Lobby</p>
          <p style={{ color: "red" }}>{this.state.message}</p>
        </div>
      );
    } else {
      switch (this.state.view) {
        case 0:
          return (
            <div>
              <h1>Lobby name: {this.state.data.name}</h1>
              {this.renderTable()}
              {this.renderButtonMenu()}
            </div>
          );
        case 1:
          return (
            <Game
              __token={this.props.__token}
              __dev={this.props.__dev}
              setView={this.setView}
              host={this.props.host}
              socket={this.socket}
              playerData={this.state.data.players}
            />
          );
        default:
          return <h1> You are not supposed to be here...</h1>;
      }
    }
  }
}

export default Lobby;
