import React, { Component } from "react";

class TestInput extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };
    this.handleChange = this.handleChange.bind(this);
    this.returnValue = this.returnValue.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  returnValue(event) {
    event.preventDefault();
    this.props.setValue(this.state.value);
  }

  render() {
    return (
      <div>
        <form onSubmit={this.returnValue}>
          <input
            value={this.state.value}
            name="value"
            onChange={this.handleChange}
          ></input>
          <button>Submit</button>
        </form>
      </div>
    );
  }
}

export default TestInput;
