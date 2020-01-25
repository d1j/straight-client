import React, { Component } from "react";

function HighCard(props) {
  return (
    <div>
      <h3>High Card</h3>
      <img
        src={require(`../cards/0${props.rankA}.svg`)}
        alt="card"
        height="80px"
      />
    </div>
  );
}

function Pair(props) {
  return (
    <div>
      <h3>Pair</h3>
      <img
        src={require(`../cards/0${props.rankA}.svg`)}
        alt="card"
        height="80px"
      />
      <img
        src={require(`../cards/1${props.rankA}.svg`)}
        alt="card"
        height="80px"
      />
    </div>
  );
}

function TwoPair(props) {
  return (
    <div>
      <h3>Two Pair</h3>
      <img
        src={require(`../cards/0${props.rankA}.svg`)}
        alt="card"
        height="80px"
      />
      <img
        src={require(`../cards/1${props.rankA}.svg`)}
        alt="card"
        height="80px"
      />
      <img
        src={require(`../cards/2${props.rankB}.svg`)}
        alt="card"
        height="80px"
      />
      <img
        src={require(`../cards/3${props.rankB}.svg`)}
        alt="card"
        height="80px"
      />
    </div>
  );
}

function ThreeOfAKind(props) {
  return (
    <div>
      <h3>Three Of A Kind</h3>
      <img
        src={require(`../cards/0${props.rankA}.svg`)}
        alt="card"
        height="80px"
      />
      <img
        src={require(`../cards/1${props.rankA}.svg`)}
        alt="card"
        height="80px"
      />
      <img
        src={require(`../cards/2${props.rankA}.svg`)}
        alt="card"
        height="80px"
      />
    </div>
  );
}

function Straight(props) {
  if (props.rankA == 0) {
    return (
      <div>
        <h3>Straight from 9</h3>
        <img src={require(`../cards/00.svg`)} alt="card" height="80px" />
        <img src={require(`../cards/11.svg`)} alt="card" height="80px" />
        <img src={require(`../cards/22.svg`)} alt="card" height="80px" />
        <img src={require(`../cards/33.svg`)} alt="card" height="80px" />
        <img src={require(`../cards/04.svg`)} alt="card" height="80px" />
      </div>
    );
  } else if (props.rankA == 1) {
    return (
      <div>
        <h3>Straight from 10</h3>
        <img src={require(`../cards/01.svg`)} alt="card" height="80px" />
        <img src={require(`../cards/12.svg`)} alt="card" height="80px" />
        <img src={require(`../cards/23.svg`)} alt="card" height="80px" />
        <img src={require(`../cards/34.svg`)} alt="card" height="80px" />
        <img src={require(`../cards/05.svg`)} alt="card" height="80px" />
      </div>
    );
  } else {
    return <div>rip in pepsi</div>;
  }
}

function Flush(props) {
  return (
    <div>
      <h3>Flush</h3>
      <img
        src={require(`../cards/${props.suit}0.svg`)}
        alt="card"
        height="80px"
      />
      <img
        src={require(`../cards/${props.suit}2.svg`)}
        alt="card"
        height="80px"
      />
      <img
        src={require(`../cards/${props.suit}5.svg`)}
        alt="card"
        height="80px"
      />
      <img
        src={require(`../cards/${props.suit}4.svg`)}
        alt="card"
        height="80px"
      />
      <img
        src={require(`../cards/${props.suit}3.svg`)}
        alt="card"
        height="80px"
      />
    </div>
  );
}

function FullHouse(props) {
  return (
    <div>
      <h3>Full House</h3>
      <img
        src={require(`../cards/0${props.rankA}.svg`)}
        alt="card"
        height="80px"
      />
      <img
        src={require(`../cards/1${props.rankA}.svg`)}
        alt="card"
        height="80px"
      />
      <img
        src={require(`../cards/2${props.rankA}.svg`)}
        alt="card"
        height="80px"
      />
      <img
        src={require(`../cards/3${props.rankB}.svg`)}
        alt="card"
        height="80px"
      />
      <img
        src={require(`../cards/0${props.rankB}.svg`)}
        alt="card"
        height="80px"
      />
    </div>
  );
}

function FourOfAKind(props) {
  return (
    <div>
      <h3>Four Of A Kind</h3>
      <img
        src={require(`../cards/0${props.rankA}.svg`)}
        alt="card"
        height="80px"
      />
      <img
        src={require(`../cards/1${props.rankA}.svg`)}
        alt="card"
        height="80px"
      />
      <img
        src={require(`../cards/2${props.rankA}.svg`)}
        alt="card"
        height="80px"
      />
      <img
        src={require(`../cards/3${props.rankA}.svg`)}
        alt="card"
        height="80px"
      />
    </div>
  );
}

function StraightFlush(props) {
  return (
    <div>
      <h3>Straight Flush from 9</h3>
      <img
        src={require(`../cards/${props.suit}0.svg`)}
        alt="card"
        height="80px"
      />
      <img
        src={require(`../cards/${props.suit}1.svg`)}
        alt="card"
        height="80px"
      />
      <img
        src={require(`../cards/${props.suit}2.svg`)}
        alt="card"
        height="80px"
      />
      <img
        src={require(`../cards/${props.suit}3.svg`)}
        alt="card"
        height="80px"
      />
      <img
        src={require(`../cards/${props.suit}4.svg`)}
        alt="card"
        height="80px"
      />
    </div>
  );
}
function RoyalFlush(props) {
  return (
    <div>
      <h3>Royal Flush</h3>
      <img
        src={require(`../cards/${props.suit}1.svg`)}
        alt="card"
        height="80px"
      />
      <img
        src={require(`../cards/${props.suit}2.svg`)}
        alt="card"
        height="80px"
      />
      <img
        src={require(`../cards/${props.suit}3.svg`)}
        alt="card"
        height="80px"
      />
      <img
        src={require(`../cards/${props.suit}4.svg`)}
        alt="card"
        height="80px"
      />
      <img
        src={require(`../cards/${props.suit}5.svg`)}
        alt="card"
        height="80px"
      />
    </div>
  );
}

export default class CurrentCall extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    switch (this.props.comb) {
      case 0:
        return <HighCard rankA={this.props.rankA} />;
      case 1:
        return <Pair rankA={this.props.rankA} />;
      case 2:
        return <TwoPair rankA={this.props.rankA} rankB={this.props.rankB} />;
      case 3:
        return <ThreeOfAKind rankA={this.props.rankA} />;
      case 4:
        return <Straight rankA={this.props.rankA} />;
      case 5:
        return <Flush suit={this.props.suit} />;
      case 6:
        return <FullHouse rankA={this.props.rankA} rankB={this.props.rankB} />;
      case 7:
        return <FourOfAKind rankA={this.props.rankA} />;
      case 8:
        return <StraightFlush suit={this.props.suit} />;
      case 9:
        return <RoyalFlush suit={this.props.suit} />;
      default:
        return <h3>Waiting for the first call...</h3>;
    }
  }
}
