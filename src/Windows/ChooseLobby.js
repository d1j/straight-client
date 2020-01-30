import React, { Component } from "react";
import axios from "axios";

class ChooseLobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      message: "",
      data: {},
      page: 1,
      lobbiesOnPage: 10,
      lobbyPasword: "",
      chosenIndex: null,
      password: "",
      searchString: ""
    };

    this.renderTable = this.renderTable.bind(this);
    this.chooseLobby = this.chooseLobby.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.backView = this.backView.bind(this);
    this.joinLobby = this.joinLobby.bind(this);
    this.refreshLobbies = this.refreshLobbies.bind(this);
  }

  componentDidMount() {
    this.refreshLobbies();
  }

  refreshLobbies() {
    let self = this;
    this.setState({ loading: true });
    axios
      .post(`${self.props.host}/lobby/list`, {
        token: self.props.__token,
        page: self.state.page,
        lobbiesOnPage: self.state.lobbiesOnPage,
        search: self.state.searchString
      })
      .then(res => {
        self.setState({ data: res.data, loading: false, chosenIndex: null });
      })
      .catch(err => {
        console.log(err);
        self.setState({
          message: "Error occurred while getting lobby information",
          chosenIndex: null
        });
      });
  }

  chooseLobby(event) {
    this.setState({ chosenIndex: +event.target.name });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value, message: "" });
  }

  backView() {
    this.props.setView(0);
  }

  joinLobby() {
    if (this.state.chosenIndex == null) {
      this.setState({ message: "Please choose a lobby to join." });
    } else if (
      this.state.password.length === 0 &&
      this.state.data[this.state.chosenIndex].requiresPassword
    ) {
      this.setState({ message: "Please enter the lobby password." });
    } else {
      this.props.joinLobby(
        this.state.data[this.state.chosenIndex]._id,
        this.state.password
      );
    }
  }
  renderTable() {
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Lobby Name</th>
              <th>Player count</th>
              <th>Status</th>
              <th>Requires password</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map((lobby, index) => {
              return (
                <tr
                  key={index}
                  style={{
                    backgroundColor:
                      this.state.chosenIndex === index ? "black" : "white"
                  }}
                >
                  <th>{lobby.name}</th>
                  <th>{`${lobby.playerCount}/6`}</th>
                  <th>{lobby.status}</th>
                  <th>{lobby.requiresPassword ? "Yes" : "No"}</th>
                  <th>
                    <button name={index} onClick={this.chooseLobby}>
                      Choose
                    </button>
                  </th>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p>Password</p>
        <input name="password" onChange={this.handleChange} />
        <p>Page</p>
        <input
          name="page"
          value={this.state.page}
          onChange={this.handleChange}
        />
        <p>Lobbies on page</p>
        <input
          name="lobbiesOnPage"
          value={this.state.lobbiesOnPage}
          onChange={this.handleChange}
        />
        <br />
        <p>Search string</p>
        <input
          name="searchString"
          value={this.state.searchString}
          onChange={this.handleChange}
        />
        {/*TODO: Protect from spam*/}
        <button onClick={this.joinLobby}>Join</button>
        {/*TODO: Protect from spam*/}
        <button onClick={this.refreshLobbies}>Refresh</button>{" "}
        <button onClick={this.backView}>Back</button>
        <p style={{ color: "red" }}>{this.state.message}</p>
      </div>
    );
  }

  render() {
    if (this.state.loading) {
      return (
        <div>
          <p>Loading... ChooseLobby</p>
          <p style={{ color: "red" }}>{this.state.message}</p>
        </div>
      );
    } else {
      return this.renderTable();
    }
  }
}

export default ChooseLobby;
