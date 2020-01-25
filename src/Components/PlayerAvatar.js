import React, { Component } from "react";
import Card from "./Card";

/**
 * props: {
 *  cards: [],
 *  num_cards: 0 < Number < 5,
 *  player_id: String,
 *  username: String,
 *  is_current_player: Boolean
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
        backgroundColor: this.props.is_current_player
          ? "rgb(255, 200,200)"
          : "rgb(36, 112, 33)"
      }
    };
  }
  render() {
    if (+this.props.num_cards <= 0 || +this.props.num_cards >= 5) {
      //Cards haven't been dealt yet.
      return (
        <div style={this.state.style}>
          <h2>
            {this.props.player_id}:<b>{this.props.username}</b>
          </h2>
        </div>
      );
    } else {
      if (this.props.cards.length === 0) {
        //Display hidden cards
        return (
          <div style={this.state.style}>
            <h2>
              {this.props.player_id}:<b>{this.props.username}</b>
            </h2>
            {Array.apply(null, { length: +this.props.num_cards }).map(
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
              {this.props.player_id}:<b>{this.props.username}</b>
            </h2>
            <UserCards
              cards={this.props.cards}
              num_cards={this.props.num_cards}
            />
          </div>
        );
      }
    }
  }
}

export default PlayerAvatar;
