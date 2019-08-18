import React from "react";
import "./Home.css";
import Login from "./Windows/Login";
import Register from "./Windows/Register";
import MainMenu from "./Windows/MainMenu";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 0
    };

    this.setView = this.setView.bind(this);
    this.goToLogin = this.goToLogin.bind(this);
    this.goToRegister = this.goToRegister.bind(this);
  }

  setView(p_view) {
    this.setState({ view: p_view });
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
            <button onClick={this.goToLogin}> Login </button>
            <button onClick={this.goToRegister}> Register </button>
          </div>
        );
      case 1: //Login screen
        return <Login setView={this.setView} />;
      case 2: //Register screen
        return <Register setView={this.setView} />;
      case 3: //home screen/post login
        return <MainMenu setView={this.setView} />;
    }
  }
}

export default Home;
