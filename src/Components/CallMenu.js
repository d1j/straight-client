import React, { Component } from "react";

import SubCall from "./SubCall";

//Main Entry
class CallMenu extends Component {
  constructor(props) {
    super(props);
    //Subs - Sub-Displays/Sub-ranks/Sub-choices
    //Player makes a call in such order:
    //Choses from the list of combinations
    //Depending on chosen combination, one or two aditional "sub-displays" pop up
    //Those sub displays allow user to specify card ranks(9,10,J,Q,K,A) or suits(...)
    this.state = {
      combs: [
        "High Card",
        "Pair",
        "Two pair",
        "Three of kind",
        "Straight",
        "Flush",
        "Full-House",
        "Four of a Kind",
        "Straight Flush",
        "Royal Flush"
      ],

      chosenComb: -1,
      chosenRankA: -1,
      chosenRankB: -1,
      chosenSuit: -1,

      canDisplaySubs: false
    };

    this.updateSubs = this.updateSubs.bind(this);
    this.renderSub = this.renderSub.bind(this);

    this.setRankA = this.setRankA.bind(this);
    this.setRankB = this.setRankB.bind(this);
    this.setSuit = this.setSuit.bind(this);

    this.setCall = this.setCall.bind(this);
  }

  setCall() {
    this.props.setCall(
      this.state.chosenComb,
      this.state.chosenRankA,
      this.state.chosenRankB,
      this.state.chosenSuit
    );
  }

  setRankA(rank) {
    this.setState({ chosenRankA: rank }, () => {
      this.setCall();
    });
  }
  setRankB(rank) {
    this.setState({ chosenRankB: rank }, () => {
      this.setCall();
    });
  }
  setSuit(suit) {
    this.setState({ chosenSuit: suit }, () => {
      this.setCall();
    });
  }

  renderSub() {
    if (this.state.canDisplaySubs) {
      return (
        <SubCall
          comb={this.state.chosenComb}
          rankA={this.state.chosenRankA}
          rankB={this.state.chosenRankB}
          suit={this.state.chosenSuit}
          setRankA={this.setRankA}
          setRankB={this.setRankB}
          setSuit={this.setSuit}
        />
      );
    }
  }

  //Enables chosen combination sub-display
  //Closes sub-display if already open
  updateSubs(e) {
    if (this.state.chosenComb === +e.target.id) {
      this.setState({
        canDisplaySubs: false,
        chosenComb: -1
      });
    } else {
      this.setState({ canDisplaySubs: true, chosenComb: +e.target.id });
    }
    this.setState({ chosenRankA: -1, chosenRankB: -1, chosenSuit: -1 }, () => {
      this.setCall();
    });
  }

  render() {
    return (
      <div>
        {/*Combination div */}
        <div className="display-inline">
          {this.state.combs.map((comb, index) => {
            return (
              <div key={index}>
                <button
                  onClick={this.updateSubs}
                  id={index}
                  className={
                    index === this.state.chosenComb
                      ? "call-active-button"
                      : "call-button"
                  }
                >
                  {comb}
                </button>
                <br />
              </div>
            );
          })}
        </div>
        <div className="display-inline">{this.renderSub()}</div>
      </div>
    );
  }
}

export default CallMenu;
