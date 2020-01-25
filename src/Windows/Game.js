import React, { Component } from "react";

import CallMenu from "../Components/CallMenu";
import PlayerAvatar from "../Components/PlayerAvatar";
import CurrentCall from "../Components/CurrentCall";

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      combs: [
        "High Card",
        "Pair",
        "Two pair",
        "Three of kind",
        "Straight",
        "Flush",
        "Full-House",
        "Four of a Kind",
        "Straight Flush",
        "Royal Flush"
      ],
      ranks: ["Nine", "Ten", "Jack", "Queen", "King", "Ace"],
      suits: ["♠ Spades ♠", "♡ Hearts ♡", "♢ Diamonds ♢", "♣ Clubs ♣"],

      currentComb: -1,
      currentRankA: -1,
      currentRankB: -1,
      currentSuit: -1,

      selectedComb: -1,
      selectedRankA: -1,
      selectedRankB: -1,
      selectedSuit: -1,

      currPlayerID: -1,
      currCallText: "No call was made yet",
      selectedCallText: "Make a Call",
      callValidity: "invalid",

      isUserCurrPlayer: false,
      userPlayerID: -1,
      lostPlayerID: -1,
      playerData: [],

      activityLog: [],
      maxLogLength: 10,

      inputMessage: "",

      loading: true
    };

    for (let i = 0; i < this.props.playerData.length; i++) {
      this.state.playerData.push({
        player_id: this.props.playerData[i].player_id,
        username: this.props.playerData[i]._id.username,
        is_user: this.props.playerData[i].isUser,
        is_current_player: false,
        num_cards: 1,
        cards: []
      });
    }

    this.props.socket.on("player-is-ready", data => {
      if (this.props.__dev)
        console.log(`(SOCKET.IO) player-is-ready || ${data}`);
    });

    this.props.socket.on("current-player", data => {
      if (this.props.__dev)
        console.log(`(SOCKET.IO) current-player || ${data}`);

      this.setState({
        currPlayerID: data
      });
    });

    this.props.socket.on("dealt-cards", data => {
      if (this.props.__dev) {
        console.log(`(SOCKET.IO) dealt-cards`);
        console.log(data);
      }
      let index = this.findUserIndex(this.state.userPlayerID);
      this.state.playerData[index].cards = data;
      this.forceUpdate();
    });

    this.props.socket.on("next-player-can-call", () => {
      if (this.props.__dev) console.log(`(SOCKET.IO) next-player-can-call`);

      if (this.state.currPlayerID == this.state.userPlayerID) {
        this.addNewMessage(`You are now making a decision.`);
      } else {
        let index = this.findUserIndex(this.state.currPlayerID);
        let username = this.state.playerData[index].username;
        this.addNewMessage(`${username} is now making a decision.`);
      }

      this.setState({
        isUserCurrPlayer:
          this.state.userPlayerID == this.state.currPlayerID ? true : false
      });
    });

    this.props.socket.on("started-hand", () => {
      if (this.props.__dev) console.log(`(SOCKET.IO) started-hand `);

      //lostPlayerID will be set in hand-result
      //if lostPlayerID != -1, it means that the player got +1 card and the client has not updated player's num_cards yet
      if (this.state.lostPlayerID != -1) {
        let _index = this.findUserIndex(this.state.lostPlayerID);
        this.state.playerData[_index].num_cards++;
        this.addNewMessage(
          `${this.state.playerData[_index].username} received +1 card.`
        );
      }

      let index = this.findUserIndex(this.state.currPlayerID);
      this.addNewMessage(
        `${this.state.playerData[index].username} is now calling.`
      );

      this.setState({
        isUserCurrPlayer:
          this.state.userPlayerID == this.state.currPlayerID ? true : false,
        lostPlayerID: -1
      });
    });

    this.props.socket.on("all-players-are-ready", () => {
      if (this.props.__dev) console.log("(SOCKET.IO) all-players-are-ready");
    });

    this.props.socket.on("player-called", data => {
      if (this.props.__dev) {
        console.log("(SOCKET.IO) player-called");
        console.log(data);
      }
      let index = this.findUserIndex(this.state.currPlayerID);
      this.addNewMessage(`${this.state.playerData[index].username} called.`);
      this.setState({
        currentComb: data.comb,
        currentRankA: data.rankA,
        currentRankB: data.rankB,
        currentSuit: data.suit
      });
      this.updateCallText("current");
      //TODO: Display current call bar
    });

    this.props.socket.on("player-checked", () => {
      if (this.props.__dev) {
        console.log("(SOCKET.IO) player-checked");
      }
      let _index = this.findUserIndex(this.state.currPlayerID);
      this.addNewMessage(
        `${this.state.playerData[_index].username} has checked.`
      );
    });
    /**
      [
        { status: "playing", cards: [{ s: 1, r: 4 }], player_id: 0, num_cards: 1 },
        { status: "playing", cards: [{ s: 0, r: 5 }], player_id: 1, num_cards: 1 }
      ];
     */
    this.props.socket.on("all-cards", data => {
      if (this.props.__dev) {
        console.log("(SOCKET.IO) all-cards");
        console.log(data);
      }
      this.addNewMessage(`Displaying all cards.`);
      for (let i = 0; i < data.length; i++) {
        let index = this.findUserIndex(data[i].player_id);
        if (data[i].status == "playing") {
          this.state.playerData[index].cards = data[i].cards;
          this.state.playerData[index].num_cards = data[i].num_cards;
        } else {
          this.state.playerData[index].cards = [];
          this.state.playerData[index].num_cards = -1;
        }
      }
      this.forceUpdate();
    });

    this.props.socket.on("hand-result", data => {
      if (this.props.__dev) {
        console.log("(SOCKET.IO) hand-result");
        console.log(data);
      }
      let index = this.findUserIndex(data.lost_player);
      this.addNewMessage(
        `${this.state.playerData[index].username} lost the hand.`
      );
      this.setState({ lostPlayerID: data.lost_player });
    });

    this.props.socket.on("refresh-hand", () => {
      if (this.props.__dev) {
        console.log("(SOCKET.IO) refresh-hand");
      }
      this.addNewMessage(`A new hand will start soon.`);
      this.resetHand();
    });

    this.props.socket.on("player-out", data => {
      if (this.props.__dev) {
        console.log("(SOCKET.IO) player-out");
        console.log(data);
      }
      let index = this.findUserIndex(data);
      if (data == this.state.userPlayerID) {
        this.addNewMessage(`You got the 5th card and are now spectating.`);
      } else {
        this.addNewMessage(
          `${this.state.playerData[index].username} got the 5th card and is now spectating.`
        );
      }
      this.state.playerData[index].num_cards = -1;
      this.state.playerData[index].cards = [];
      this.forceUpdate();
    });

    this.props.socket.on("player-won", data => {
      if (this.props.__dev) {
        console.log("(SOCKET.IO) player-won");
        console.log(data);
      }
      let index = this.findUserIndex(data);
      this.addNewMessage(
        `${this.state.playerData[index].username} won the game!`
      );
    });

    this.props.socket.on("return-to-lobby", () => {
      if (this.props.__dev) {
        console.log("(SOCKET.IO) return-to-lobby");
      }
      this.props.setView(0);
    });

    this.props.socket.on("message", data => {
      if (this.props.__dev) {
        console.log("(SOCKET.IO) message");
        console.log(data);
      }
      let index = this.findUserIndex(data.player_id);
      this.addNewMessage(
        `${this.state.playerData[index].username}: ${data.message}`
      );
    });

    this.c_setCall = this.c_setCall.bind(this);
    this.resetHand = this.resetHand.bind(this);
    this.updateCallText = this.updateCallText.bind(this);
    this.checkSelectedValidity = this.checkSelectedValidity.bind(this);
    this.displayCallBar = this.displayCallBar.bind(this);
    this.displayGameTable = this.displayGameTable.bind(this);
    this.displayActivityLog = this.displayActivityLog.bind(this);
    this.displayPlayers = this.displayPlayers.bind(this);
    this.addNewMessage = this.addNewMessage.bind(this);
    this.findUserIndex = this.findUserIndex.bind(this);
    this.sendCall = this.sendCall.bind(this);
    this.sendCheck = this.sendCheck.bind(this);
    this.displayCurrentCall = this.displayCurrentCall.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  sendMessage(e) {
    e.preventDefault();
    this.props.socket.emit("message", this.state.inputMessage);
    this.setState({ inputMessage: "" });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  findUserIndex(id) {
    for (let i = 0; i < this.state.playerData.length; i++) {
      if (this.state.playerData[i].player_id == id) {
        return i;
      }
    }
    return -1;
  }

  componentDidMount() {
    /**
     *  0: {_id: {…}, player_id: 0, isHost: true, isUser: false}
        1:
          _id: {wonGames: {…}, playedGames: 0, username: "qwe"}
          player_id: 1
          isHost: false
          isUser: true
     */
    let playerData = this.props.playerData;
    let userPlayerID;
    for (let i = 0; i < playerData.length; i++) {
      if (playerData[i].isUser) {
        userPlayerID = playerData[i].player_id;
      }
    }
    this.props.socket.emit("ready-to-start-game");
    this.addNewMessage("The game has started.");
    this.addNewMessage("Waiting for the server to deal cards.");
    this.setState({ loading: false, userPlayerID });
  }

  c_setCall(comb, rankA, rankB, suit) {
    this.setState(
      {
        selectedComb: comb,
        selectedRankA: rankA,
        selectedRankB: rankB,
        selectedSuit: suit
      },
      () => {
        this.updateCallText("selected");
        this.checkSelectedValidity();
      }
    );
  }

  resetHand() {
    for (let i = 0; i < this.state.playerData.length; i++) {
      if (this.state.playerData[i].player_id != this.state.userPlayerID) {
        this.state.playerData[i].cards = [];
      }
    }
    this.forceUpdate();
    this.setState(
      {
        currCallText: "No call was made yet",
        selectedCallText: "Make a Call",
        callValidity: "invalid",

        currentComb: -1,
        currentRankA: -1,
        currentRankB: -1,
        currentSuit: -1,

        selectedComb: -1,
        selectedRankA: -1,
        selectedRankB: -1,
        selectedSuit: -1
      },
      () => {
        this.updateCallText("current");
        this.updateCallText("select");
      }
    );
  }

  updateCallText(currSel) {
    let text;

    let comb, rankA, rankB, suit;

    if (currSel === "current") {
      text = this.state.combs[this.state.currentComb];
      comb = this.state.currentComb;
      rankA = this.state.currentRankA;
      rankB = this.state.currentRankB;
      suit = this.state.currentSuit;
    } else {
      text = this.state.combs[this.state.selectedComb];
      comb = this.state.selectedComb;
      rankA = this.state.selectedRankA;
      rankB = this.state.selectedRankB;
      suit = this.state.selectedSuit;
    }

    let checkA = () => {
      return rankA !== -1 ? true : false;
    };

    let checkB = () => {
      return rankB !== -1 ? true : false;
    };
    let checkSuit = () => {
      return suit !== -1 ? true : false;
    };

    switch (comb) {
      case 0:
        if (checkA()) {
          text += "|" + this.state.ranks[rankA];
        } else {
          text = "Make a Call";
        }
        break;
      case 1:
        if (checkA()) {
          text += "|2x" + this.state.ranks[rankA];
        } else {
          text = "Make a Call";
        }
        break;
      case 2:
        if (checkA() && checkB()) {
          text +=
            "|2x" + this.state.ranks[rankA] + "|2x" + this.state.ranks[rankB];
        } else {
          text = "Make a Call";
        }
        break;
      case 3:
        if (checkA()) {
          text += "|3x" + this.state.ranks[rankA];
        } else {
          text = "Make a Call";
        }
        break;
      case 4:
        if (checkA()) {
          text += "|from " + this.state.ranks[rankA];
        } else {
          text = "Make a Call";
        }
        break;
      case 5:
        if (checkSuit()) {
          text += "|of " + this.state.suits[suit];
        } else {
          text = "Make a Call";
        }
        break;
      case 6:
        if (checkA() && checkB()) {
          text +=
            "|3x" + this.state.ranks[rankA] + "|2x" + this.state.ranks[rankB];
        } else {
          text = "Make a Call";
        }
        break;
      case 7:
        if (checkA()) {
          text += "|4x" + this.state.ranks[rankA];
        } else {
          text = "Make a Call";
        }
        break;
      case 8:
        if (checkSuit()) {
          text += "|from Nine|of " + this.state.suits[suit];
        } else {
          text = "Make a Call";
        }
        break;
      case 9:
        if (checkSuit()) {
          text += "|of " + this.state.suits[suit];
        } else {
          text = "Make a Call";
        }
        break;
      default:
        text = "Make a call";
    }
    if (currSel === "current") {
      this.setState({ currCallText: text });
    } else if (currSel === "selected") {
      this.setState({ selectedCallText: text });
    }
  }

  checkSelectedValidity() {
    let validity;
    let containedValidity = () => {
      if (this.state.selectedRankA > this.state.currentRankA) {
        validity = true;
      } else {
        validity = false;
      }
    };

    let checkA = () => {
      return this.state.selectedRankA !== -1 ? true : false;
    };

    let checkB = () => {
      return this.state.selectedRankB !== -1 ? true : false;
    };

    let checkSuit = () => {
      return this.state.selectedSuit !== -1 ? true : false;
    };

    if (this.state.selectedComb > this.state.currentComb) {
      switch (this.state.selectedComb) {
        case 0: //HIGH
          checkA() ? (validity = true) : (validity = false);
          break;
        case 1: //PAIR
          checkA() ? (validity = true) : (validity = false);
          break;
        case 2: //TWO PAIR
          checkA() &&
          checkB() &&
          this.state.selectedRankA !== this.state.selectedRankB
            ? (validity = true)
            : (validity = false);
          break;
        case 3: //THREE
          checkA() ? (validity = true) : (validity = false);
          break;
        case 4: //STRAIGHT
          checkA() ? (validity = true) : (validity = false);
          break;
        case 5: //FLUSH
          checkSuit() ? (validity = true) : (validity = false);
          break;
        case 6: //FULL HOUSE
          checkA() &&
          checkB() &&
          this.state.selectedRankA !== this.state.selectedRankB
            ? (validity = true)
            : (validity = false);
          break;
        case 7: //FOUR
          checkA() ? (validity = true) : (validity = false);
          break;
        case 8: //STRAIGHT FLUSH
        case 9: //ROYAL FLUSH
          checkSuit() ? (validity = true) : (validity = false);
          break;
        default:
          console.log("unexpected behaviour @Game.js checkSelectedValidity()");
      }
    } else if (this.state.selectedComb === this.state.currentComb) {
      switch (this.state.selectedComb) {
        case 0:
          if (checkA()) containedValidity();
          break;
        case 1:
          if (checkA()) containedValidity();
          break;
        case 2:
          if (checkA() && checkB()) {
            if (this.state.selectedRankA === this.state.selectedRankB) {
              validity = false;
            } else {
              let rankA, rankB;
              if (this.state.selectedRankA > this.state.selectedRankB) {
                rankA = this.state.selectedRankA;
                rankB = this.state.selectedRankB;
              } else {
                rankA = this.state.selectedRankB;
                rankB = this.state.selectedRankA;
              }
              if (rankA > this.state.currentRankA) {
                validity = true;
              } else if (rankA === this.state.currentRankA) {
                if (rankB > this.state.currentRankB) {
                  validity = true;
                } else {
                  validity = false;
                }
              } else {
                validity = false;
              }
            }
          }
          break;
        case 3:
          if (checkA()) containedValidity();
          break;
        case 4:
          if (this.state.selectedRankA > this.state.currentRankA && checkA()) {
            validity = true;
          } else {
            validity = false;
          }
          break;
        case 5:
          validity = false;
          break;
        case 6:
          if (checkA() && checkB()) {
            if (this.state.selectedRankA === this.state.selectedRankB) {
              validity = false;
            } else {
              if (this.state.selectedRankA > this.state.currentRankA) {
                validity = true;
              } else if (this.state.selectedRankA === this.state.currentRankA) {
                if (this.state.selectedRankB > this.state.currentRankB) {
                  validity = true;
                } else {
                  validity = false;
                }
              } else {
                validity = false;
              }
            }
          }
          break;
        case 7:
          if (checkA()) containedValidity();
          break;
        case 8:
        case 9:
          validity = false;
          break;
        default:
          console.log("unexpected behaviour @Game.js checkSelectedValidity()");
      }
    } else {
      validity = false;
    }
    this.setState(
      validity ? { callValidity: "valid" } : { callValidity: "invalid" }
    );
  }

  sendCall() {
    if (this.state.callValidity == "valid") {
      let call = {
        comb: this.state.selectedComb,
        rankA: this.state.selectedRankA,
        rankB: this.state.selectedRankB,
        suit: this.state.selectedSuit
      };
      this.props.socket.emit("call", call);
      this.setState({ isUserCurrPlayer: false });
      this.addNewMessage("You made a call.");
    }
  }

  sendCheck() {
    if (this.state.currentComb > -1 && this.state.currentComb < 10) {
      this.props.socket.emit("check");
      this.setState({ isUserCurrPlayer: false });
    }
  }

  displayCallBar() {
    if (this.state.isUserCurrPlayer) {
      return (
        <div
          style={{ height: "100vh", width: "35vw", border: "3px solid black" }}
        >
          <h2 className="message-display">
            Current call is: <br />
            <span className="current-call">{this.state.currCallText}</span>
          </h2>
          <h2 className="message-display">
            Your call is:
            <br />
            <span className="current-call">{this.state.selectedCallText}</span>
          </h2>
          <button onClick={this.sendCall}>Make a Call</button>
          <button onClick={this.sendCheck} style={{ marginBottom: "0.5vw" }}>
            Check
          </button>
          <h2 className="message-display">
            Call validity:
            <br />
            <span
              className="current-call"
              style={
                this.state.callValidity === "valid"
                  ? { backgroundColor: "green" }
                  : { backgroundColor: "red" }
              }
            >
              {this.state.callValidity}
            </span>
          </h2>
          <CallMenu setCall={this.c_setCall} />
        </div>
      );
    }
  }

  addNewMessage(message) {
    let log = this.state.activityLog;

    let date = new Date();
    let currentTime =
      date.getHours() +
      ":" +
      date.getMinutes() +
      ":" +
      date.getSeconds() +
      "| ";
    if (log.length >= this.state.maxLogLength) {
      for (let i = 0; i < this.state.maxLogLength - 1; i++) {
        this.state.activityLog[i] = this.state.activityLog[i + 1];
      }
      this.state.activityLog[this.state.maxLogLength - 1] =
        currentTime + message;
    } else {
      this.state.activityLog[log.length] = currentTime + message;
    }
    this.forceUpdate();
  }

  displayCurrentCall() {
    return (
      <div>
        <h4>Current Call</h4>
        <CurrentCall
          comb={this.state.currentComb}
          rankA={this.state.currentRankA}
          rankB={this.state.currentRankB}
          suit={this.state.currentSuit}
        />
      </div>
    );
  }

  displayActivityLog() {
    return (
      <div
        style={{
          width: "20vw",
          height: "100vh",
          backgroundColor: "rgb(228, 250, 227)",
          border: "3px solid black"
        }}
      >
        {this.state.activityLog.map((message, index) => {
          return (
            <p
              key={index}
              style={{
                marginTop: "5px",
                paddingLeft: "10px",
                border: "1px solid black",
                backgroundColor: "white",
                width: "100%"
              }}
            >
              {message}
            </p>
          );
        })}
        <form onSubmit={this.sendMessage}>
          <input
            value={this.state.inputMessage}
            name="inputMessage"
            onChange={this.handleChange}
            required
          ></input>
          <button type="submit">Send</button>
        </form>
      </div>
    );
  }

  displayPlayers() {
    return (
      <div>
        {this.state.playerData.map((player, index) => {
          return (
            <PlayerAvatar
              key={index}
              cards={player.cards}
              num_cards={player.num_cards}
              player_id={player.player_id}
              username={player.username}
              is_current_player={player.is_current_player}
            />
          );
        })}
        {this.displayCurrentCall()}
      </div>
    );
  }

  displayGameTable() {
    return (
      <div
        style={{
          width: this.state.isUserCurrPlayer ? "65vw" : "100vw",
          backgroundColor: "rgb(36, 112, 33)",
          display: "flex"
        }}
      >
        {this.displayActivityLog()}
        {this.displayPlayers()}
      </div>
    );
  }

  render() {
    if (this.state.loading) {
      return <div>LOADING...</div>;
    } else {
      if (this.state.isUserCurrPlayer)
        return (
          <div style={{ display: "flex" }}>
            {this.displayCallBar()}

            {this.displayGameTable()}
          </div>
        );
      else {
        return <div>{this.displayGameTable()}</div>;
      }
    }
  }
}

export default Game;
