import React from 'react';
import { Paper, Fab, Typography } from '@material-ui/core';
import { ReactComponent as PlusIcon } from '../plus-icon.svg';
import { ReactComponent as MinusIcon } from '../minus-icon.svg';
import Draggable from "react-draggable";
import TransparentButton from "./TransparentButton";
import { useSpring, animated, config } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import { clamp } from 'lodash';

export function ZoomBarF(props) {
  const [{ x }, set] = useSpring(() => ({ x: 0, config: {
     friction: props.friction, 
     tension: props.tension,
     clamp: true,
  }}))

  const ref = React.useRef(null);

  const bind = useDrag(({ down, movement: [x], event }) => {
    event.preventDefault();
    // event.stopPropagation();

    const limit = 80;
    // const dir = xDir < 0 ? -1 : 1
    const nextX = Math.abs(x) > limit ? limit * Math.sign(x) : x;
    // const f = down ? props.friction / 2 : props.friction
    // const t = down ? props.tension / 2 : props.tension
    set({ x: down ? clamp(x, -limit, limit) : 0 })
    // set({ x: down ? x : 0 })
    // set({ x: down ? nextX : 0 })
    
  }, { event: { passive: false, capture: false }, domTarget: ref })
  
  React.useEffect(bind, [bind])

  return (
    <animated.div ref={ref}
      // {...bind()}
      style={{
        transform: x.interpolate(x => `translate3D(${x}px, 0, 0)`),
        width: 80,
        height: 80,
        // background: "hotpink",
        borderRadius: '50rem',
      }} 
      >
      <Fab 
      onClick={ e => {
          e.preventDefault();
          console.log("click")
        }
      }
      style={{
        width: 70,
        height: 70
      }}>
        100%
      </Fab>
      </animated.div>
  )
}

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
  }

  render() {
    let fabSize = 70;

    let maxWidth = 240;

    return (
      <div style={{
        height: "80px",
        display: "flex"
      }}>
        <Paper style={{
          borderRadius: "5em",
          maxWidth: maxWidth,
          margin: "auto",
          display: "flex",
          justifyContent: "space-between",
        }}>
          <TransparentButton>
            <MinusIcon />
          </TransparentButton>
          <div style={{
            width: fabSize+20,
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

                width: fabSize,
                marginLeft: -fabSize/2,
                left: "50%",

                height: fabSize,
                marginTop: -fabSize/2,
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