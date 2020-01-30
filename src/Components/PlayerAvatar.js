import React, { Component } from "react";
import Card from "./Card";

/**
 * props: {
 *  cards: [],
 *  numCards: 0 < Number < 5,
 *  playerID: String,
 *  username: String,
 *  isCurrentPlayer: Boolean
 * }
 */

function UserCards(props) {
  return (
    <div>
      {props.cards.map((card, index) => {
        return (
          <Card
            key={index}
            suit={card.s}
            rank={card.r}
            height="80px"
            back="true"
          />
        );
      })}
    </div>
  );
}

class PlayerAvatar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      style: {
        marginTop: "10px",
        marginLeft: "20px",
        backgroundColor: this.props.isCurrentPlayer
          ? "rgb(255, 200,200)"
          : "rgb(36, 112, 33)"
      }
    };
  }
  render() {
    if (+this.props.numCards <= 0 || +this.props.numCards >= 5) {
      //Cards haven't been dealt yet.
      return (
        <div style={this.state.style}>
          <h2>
            {this.props.playerID}:<b>{this.props.username}</b>
          </h2>
        </div>
      );
    } else {
      if (this.props.cards.length === 0) {
        //Display hidden cards
        return (
          <div style={this.state.style}>
            <h2>
              {this.props.playerID}:<b>{this.props.username}</b>
            </h2>
            {Array.apply(null, { length: +this.props.numCards }).map(
              (yeet, index) => {
                return (
                  <img
                    key={index}
                    src={require(`../cards/back.svg`)}
                    alt="card-back"
                    height="80px"
                  />
                );
              }
            )}
          </div>
        );
      } else {
        //Display open cards
        return (
          <div style={this.state.style}>
            <h2>
              {this.props.playerID}:<b>{this.props.username}</b>
            </h2>
            <UserCards
              cards={this.props.cards}
              numCards={this.props.numCards}
            />
          </div>
        );
      }
    }
  }
}

export default PlayerAvatar;
