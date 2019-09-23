import React, { Component } from "react";
import socketIOClient from "socket.io-client";

class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHost: false,
      playerID: null,

      loading: true,
      message: "",
      data: this.props.data
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
      if (this.props.__dev) console.log("(SOCKET.IO) Joined the lobby.");
      this.setState({ loading: false });
    });

    this.socket.on("new-player-in-lobby", data => {
      if (this.props.__dev)
        console.log("(SOCKET.IO) New player joined the lobby.");
      this.state.data.players.push(data);
      this.forceUpdate();
    });

    this.socket.on("player-left", data => {
      if (this.props.__dev) console.log("(SOCKET.IO) Player left the lobby.");
      //data = {leftPlayerID, newHostID}
      let players = this.state.data.players;
      //remove player
      let leftIndex = players.findIndex(p => p.player_id == data.leftPlayerID);
      this.state.data.players.splice(leftIndex, 1);

      if (data.newHostID != -1) {
        //set new host in players array
        let newHostIndex = players.findIndex(
          p => p.player_id == data.newHostID
        );
        this.state.data.players[newHostIndex].isHost = true;
      }

      //If user is a new host
      if (data.newHostID == this.state.playerID) {
        this.state.isHost = true;
      }
      this.forceUpdate();
    });

    this.renderTable = this.renderTable.bind(this);
    this.renderButtonMenu = this.renderButtonMenu.bind(this);
    this.startGame = this.startGame.bind(this);
    this.leaveLobby = this.leaveLobby.bind(this);
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

  leaveLobby() {
    //TODO: emit disconnect
    if (this.props.__dev) console.log("(SOCKET.IO) Leaving lobby...");
    this.socket.emit("leave-lobby");
    if (this.props.__dev) console.log("(SOCKET.IO) Disconnecting.");
    this.socket.disconnect();
    this.props.setView(0);
  }

  startGame() {
    //TODO: emit start game
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
      return (
        <div>
          <h1>Lobby name: {this.state.data.name}</h1>
          {this.renderTable()}
          {this.renderButtonMenu()}
        </div>
      );
    }
  }
}

export default Lobby;
