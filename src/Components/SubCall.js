import React, { Component } from "react";

import Contained from "./combs/Contained";
import TwoCont from "./combs/TwoCont";
import Straight from "./combs/Straight";
import Flush from "./combs/Flush";

class SubCall extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    switch (this.props.comb) {
      case 0: //HIGH
        return (
          <Contained
            comment="1x"
            setRankA={this.props.setRankA}
            rankA={this.props.rankA}
          />
        );
      case 1: //PAIR
        return (
          <Contained
            comment="2x"
            setRankA={this.props.setRankA}
            rankA={this.props.rankA}
          />
        );
      case 2: //2PAIR
        return (
          <TwoCont
            firstComm="2x"
            secondComm="2x"
            setRankA={this.props.setRankA}
            setRankB={this.props.setRankB}
            rankA={this.props.rankA}
            rankB={this.props.rankB}
          />
        );
      case 3: //THREE
        return (
          <Contained
            comment="3x"
            setRankA={this.props.setRankA}
            rankA={this.props.rankA}
          />
        );
      case 4: //STRAIGHT
        return (
          <Straight setRankA={this.props.setRankA} rankA={this.props.rankA} />
        );
      case 5: //FLUSH
        return (
          <Flush
            comment="Flush"
            setSuit={this.props.setSuit}
            suit={this.props.suit}
          />
        );
      case 6: //FULL
        return (
          <TwoCont
            firstComm="3x "
            secondComm=" 2x"
            setRankA={this.props.setRankA}
            setRankB={this.props.setRankB}
            rankA={this.props.rankA}
            rankB={this.props.rankB}
          />
        );
      case 7: //FOUR
        return (
          <Contained
            comment="4x"
            setRankA={this.props.setRankA}
            rankA={this.props.rankA}
          />
        );
      case 8: //STRFLUSH
        return (
          <Flush
            comment="From 9 to K"
            setSuit={this.props.setSuit}
            suit={this.props.suit}
          />
        );
      case 9: //ROYALFLUSH
        return (
          <Flush
            comment="From 10 to A"
            setSuit={this.props.setSuit}
            suit={this.props.suit}
          />
        );
      default:
        return <div>Error: SubCall</div>;
    }
  }
}

export default SubCall;
