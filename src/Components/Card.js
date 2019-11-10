import React, { Component } from "react";
class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <img
        src={require(`../cards/${this.props.suit}${this.props.rank}.svg`)}
        alt="card"
        height={this.props.height}
      />
    );
  }
}

export default Card;
