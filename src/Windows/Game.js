import React, { Component } from "react";

import CallMenu from "../Components/CallMenu";
import PlayerAvatar from "../Components/PlayerAvatar";

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

      isCurrPlayer: true,
      currPlayerID: -1,
      currCallText: "No call was made yet",
      selectedCallText: "Make a Call",
      callValidity: "invalid",

      activityLog: [],
      maxLogLenght: 8,

      playerData: [],

      loading: true
    };

    for (let i = 0; i < this.props.playerData.length; i++) {
      this.state.playerData.push({
        player_id: this.props.playerData[i].player_id,
        username: this.props.playerData[i]._id.username,
        is_current_player: false,
        num_cards: -1,
        cards: []
      });
    }

    this.props.socket.on("player-is-ready", data => {
      if (this.props.__dev) console.log(`(SOCKET.IO) Player ${data} is ready.`);
    });

    this.props.socket.on("dealt-cards", data => {
      if (this.props.__dev)
        console.log(`(SOCKET.IO) Server has dealt the following cards:`);
      console.log(data);
    });

    this.props.socket.on("started-hand", () => {
      if (this.props.__dev)
        console.log(`(SOCKET.IO) The hand has been started.`);
    });

    this.props.socket.on("all-players-are-ready", () => {
      if (this.props.__dev)
        console.log(
          "(SOCKET.IO) All players are now waiting for the cards to be dealt."
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
  }

  componentDidMount() {
    this.props.socket.emit("ready-to-start-game");
    this.addNewMessage("The game has started.");
    this.addNewMessage("Waiting for the server to deal cards.");
    this.setState({ loading: false });
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
    this.setState(
      {
        currPlayerID: -1,

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
        selectedSuit: -1,

        isCurrPlayer: false
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

  displayCallBar() {
    if (this.state.isCurrPlayer) {
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
          <button onClick={this.makeCall}>Make a Call</button>
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
    if (log.length >= this.state.maxLogLenght) {
      for (let i = 0; i < this.state.maxLogLenght - 1; i++) {
        this.state.activityLog[i] = this.state.activityLog[i + 1];
      }
      this.state.activityLog[this.state.maxLogLenght - 1] =
        currentTime + message;
    } else {
      this.state.activityLog[log.length] = currentTime + message;
    }
    this.forceUpdate();
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
      </div>
    );
  }

  displayGameTable() {
    return (
      <div
        style={{
          width: this.state.isCurrPlayer ? "65vw" : "100vw",
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
      if (this.state.isCurrPlayer)
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
