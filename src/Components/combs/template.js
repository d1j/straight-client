import React, { Component } from "react";

class _name_ extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ranks: ["Nine", "Ten", "Jack", "Queen", "King", "Ace"],
      suits: ["Spades", "Hearts", "Diamonds", "Clubs"]
    };

    this.updateChoice = this.updateChoice.bind(this);
  }

  updateChoice(e) {
    this.props.setRankA(+e.target.id);
  }

  render() {
    return (
      <div>
        {this.state.ranks.map((rank, index) => {
          return (
            <div key={index}>
              <button
                onClick={this.updateChoice}
                id={index}
                className="callButton"
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

export default _name_;
