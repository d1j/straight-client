import React, { Component } from "react";

//HIGH CARD//PAIR//THREE OF A KIND//FOUR OF A KIND//
class Contained extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ranks: ["Nine", "Ten", "Jack", "Queen", "King", "Ace"]
    };

    this.updateChoice = this.updateChoice.bind(this);
  }

  updateChoice(e) {
    this.props.setRankA(+e.target.id);
  }

  render() {
    return (
      <div>
        <h3>Choose {this.props.comment}</h3>
        {this.state.ranks.map((rank, index) => {
          return (
            <div key={index}>
              <button
                onClick={this.updateChoice}
                id={index}
                className={
                  index === this.props.rankA
                    ? "call-active-button"
                    : "call-button"
                }
              >
                {rank}
              </button>
              <br />
            </div>
          );
        })}
      </div>
    );
  }
}

export default Contained;
