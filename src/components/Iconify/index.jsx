import React, { Component } from "react";
import { Flipper, Flipped } from "react-flip-toolkit";
import style from "./style.scss";

const Square = ({ toggleFullScreen }) => (
  <Flipped flipId="square">
    <div className="square" onClick={toggleFullScreen} />
  </Flipped>
);

const FullScreenSquare = ({ toggleFullScreen }) => (
  <Flipped flipId="square">
    <div className="full-screen-square" onClick={toggleFullScreen} />
  </Flipped>
);

class AnimatedSquare extends Component {
  state = { fullScreen: false };

  toggleFullScreen = () => {
    this.setState(prevState => ({
      fullScreen: !prevState.fullScreen
    }));
  };

  render() {
    return (
      <Flipper flipKey={this.state.fullScreen}>
        {this.state.fullScreen ? (
          <FullScreenSquare toggleFullScreen={this.toggleFullScreen} />
        ) : (
          <Square toggleFullScreen={this.toggleFullScreen} />
        )}
      </Flipper>
    );
  }
}
