import React, { Component } from "react";

class Flush extends Component {
  constructor(props) {
    super(props);

    this.state = {
      suits: ["♠ Spades ♠", "♡ Hearts ♡", "♢ Diamonds ♢", "♣ Clubs ♣"]
    };

    this.updateChoice = this.updateChoice.bind(this);
  }

  updateChoice(e) {
    this.props.setSuit(+e.target.id);
  }

  render() {
    return (
      <div>
        <h3>{this.props.comment}</h3>
        {this.state.suits.map((suit, index) => {
          return (
            <div key={index}>
              <button
                onClick={this.updateChoice}
                id={index}
                className={
                  index === this.props.suit
                    ? "call-active-button"
                    : "call-button"
                }
              >
                {suit}
              </button>
              <br />
            </div>
          );
        })}
      </div>
    );
  }
}

export default Flush;
