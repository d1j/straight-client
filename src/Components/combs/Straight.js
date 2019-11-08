import React, { Component } from "react";

class Straight extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ranks: ["9-10-J-Q-K", "10-J-Q-K-A"]
    };

    this.updateChoice = this.updateChoice.bind(this);
  }

  updateChoice(e) {
    this.props.setRankA(+e.target.id);
  }

  render() {
    return (
      <div>
        <h3>Straight</h3>
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

export default Straight;
