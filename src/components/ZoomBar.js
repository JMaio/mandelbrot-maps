import React from 'react';
import { Paper, Fab, Typography } from '@material-ui/core';
import { ReactComponent as PlusIcon } from '../plus-icon.svg';
import { ReactComponent as MinusIcon } from '../minus-icon.svg';
import Draggable from "react-draggable";
import TransparentButton from "./TransparentButton";

export default class ZoomBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zoom: 100,
      mult: 0,
      actual: 0,
    };

    this.zoomDrag = this.zoomDrag.bind(this);
  }

  zoomDrag() {
    this.setState((prev, props) => ({
      zoom: this.state.zoom + 0.01 * this.state.mult,
    }));
    // console.log(this.state.mult);
    // console.log(e.movementX);
  }

  render() {
    return (
      <div style={{
        height: "80px",
        display: "flex"
      }}>
        <Paper style={{
          borderRadius: "5em",
          maxWidth: "240px",
          margin: "auto",
          display: "flex",
          justifyContent: "space-between",
        }}>
          <TransparentButton>
            <MinusIcon />
          </TransparentButton>
          <div style={{
            width: "100px",
            position: "relative",
          }}>
            <Draggable
              axis="x"
              bounds={{ left: -80, right: 80 }}
              position={{ x: 0, y: 0 }}
              onStart={e => this.setState({
                zoomDragInterval: setInterval(this.zoomDrag, 25)
              })}
              onStop={e => {
                clearInterval(this.state.zoomDragInterval);
                this.setState({
                  actual: 0,
                  mult: 0
                })
              }}
              onDrag={e => {
                console.log(e);
                // let prev = this.state.mult
                let actual = this.state.actual
                let mult = Math.max(-80, Math.min(actual + e.movementX, 80)) / 8
                this.setState({
                  actual: actual + e.movementX,
                  mult: mult ** 2 * Math.sign(mult)
                })
                // (state, props) => ({
                //   zoom: state.zoom + 0.01*mult
                // })
              }}
            >
              <Fab style={{
                // boxShadow: "none",
                backgroundColor: "#2196f3",

                width: "80px",
                marginLeft: "-40px",
                left: "50%",

                height: "80px",
                marginTop: "-40px",
                top: "50%",

                position: "absolute",
                zIndex: "1",
              }}>
                <Typography style={{ color: "#fff" }}>
                  {this.state.zoom.toFixed(1)}%
                  </Typography>
              </Fab>
            </Draggable>
          </div>
          <TransparentButton>
            <PlusIcon />
          </TransparentButton>
        </Paper>
      </div>
    )
  }
}