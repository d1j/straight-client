import React from "react";
import "./Home.css";
import Login from "./Windows/Login";
import Register from "./Windows/Register";
import MainMenu from "./Windows/MainMenu";
import { Button } from "react-bootstrap";

import CurrentCall from "./Components/CurrentCall";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 0, //0 - home screen//1 - login screen//2 - register screen//3 - main menu screen//4 - development
      host: "http://localhost:3001",
      __token: "",
      __dev: true
    };

    this.setView = this.setView.bind(this);
    this.goToLogin = this.goToLogin.bind(this);
    this.goToRegister = this.goToRegister.bind(this);
    this.__setToken = this.__setToken.bind(this);
  }

  __setToken(token) {
    this.setState({ __token: token });
  }

  setView(_view) {
    this.setState({ view: _view });
  }

  goToLogin() {
    this.setView(1);
  }

  goToRegister() {
    this.setView(2);
  }

  render() {
    switch (this.state.view) {
      case 0: //home screen/pre-login
        return (
          <div>
            <Button onClick={this.goToLogin}> Login </Button>
            <Button onClick={this.goToRegister}> Register </Button>
          </div>
        );
      case 1: //Login screen
        return (
          <Login
            setView={this.setView}
            host={this.state.host}
            __setToken={this.__setToken}
            __dev={this.state.__dev}
          />
        );
      case 2: //Register screen
        return <Register setView={this.setView} host={this.state.host} />;
      case 3: //home screen/post login
        return (
          <MainMenu
            setView={this.setView}
            host={this.state.host}
            __dev={this.state.__dev}
            __token={this.state.__token}
          />
        );
      case 4:
        return <div>test test test</div>;
      default:
        return <h1> You are not supposed to be here...</h1>;
    }
  }
}

export default Home;
