import React, { Component } from "react";

class TwoCont extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ranks: ["Nine", "Ten", "Jack", "Queen", "King", "Ace"]
    };

    this.updateFirstChoice = this.updateFirstChoice.bind(this);
    this.updateSecondChoice = this.updateSecondChoice.bind(this);
  }

  updateFirstChoice(e) {
    this.props.setRankA(+e.target.id);
  }

  updateSecondChoice(e) {
    this.props.setRankB(+e.target.id);
  }

  render() {
    return (
      <div>
        <h3>
          Choose {this.props.firstComm} and {this.props.secondComm}
        </h3>
        {this.state.ranks.map((rank, index) => {
          return (
            <div key={index}>
              <button
                onClick={this.updateFirstChoice}
                id={index}
                className={
                  index === this.props.rankA
                    ? "call-active-button"
                    : "call-button"
                }
              >
                {rank}
              </button>
              <button
                onClick={this.updateSecondChoice}
                id={index}
                className={
                  index === this.props.rankB
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

export default TwoCont;
