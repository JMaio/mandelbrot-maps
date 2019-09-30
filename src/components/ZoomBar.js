import React, { useState, useRef, useEffect } from 'react';
import { Paper, Fab, Typography } from '@material-ui/core';
import { ReactComponent as PlusIcon } from '../plus-icon.svg';
import { ReactComponent as MinusIcon } from '../minus-icon.svg';
import Draggable from "react-draggable";
import TransparentButton from "./TransparentButton";
import { useSpring, animated, config, interpolate } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import { clamp } from 'lodash';

export function ZoomBarPaper(props) {
  let fabSize = 70;
  let maxWidth = 240;
  const [zoom, setZoom] = useState(100);

  return (
    <div style={{
        width: fabSize,
        display: "flex"
      }}>
        <Paper style={{
          borderRadius: "5em",
          maxHeight: maxWidth,
          margin: "auto",
          display: "flex",
          flexDirection: "column-reverse",
          justifyContent: "space-between",
        }}>
          <TransparentButton>
            <MinusIcon />
          </TransparentButton>
          <div style={{
            height: fabSize,
            position: "relative",
          }}>
            <ZoomBarF diameter={fabSize} zoom={zoom} zoomControl={setZoom} />
          </div>
          <TransparentButton>
            <PlusIcon />
          </TransparentButton>
        </Paper>
      </div>
  )
}

export function ZoomBarF(props) {
  const [{ y }, set] = useSpring(() => ({ y: 0, config: {
     friction: 40, 
     tension: 500,
     clamp: true,
  }}))
  
  const [zoom, setZoom] = [props.zoom, props.zoomControl];
  
  const ref = React.useRef(null);
  const [gestureDown, setGestureDown] = useState(false);
  const [zoomMult, setZoomMult] = useState(0);
  
  const springZoom = useSpring({ zoom: zoom })

  const reset = () => {
    setZoom(100);
  }

  // https://upmostly.com/tutorials/setinterval-in-react-components-using-hooks
  function useInterval(callback, delay) {
    const savedCallback = useRef();
  
    useEffect(() => {
      savedCallback.current = callback;
    });
  
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  useInterval(() => {
    const z = clamp(props.zoom + 2e-4 * (props.zoom ** 0.5) * zoomMult, 0.01, 9999);
    console.log(`updating zoom (${props.zoom}) + ${zoomMult}`);
    setZoom(z);
  }, gestureDown ? 10 : null);

  const bind = useDrag(({ down, movement: [x, y], event, first, last }) => {
    // only prevent default between first and last event
    // first: prevents browser events
    // last: allows buttons to activate and ripple
    (!first && !last) && event.preventDefault();
    
    setGestureDown(down);
    
    const limit = 80;
    const clampY = clamp(y, -limit, limit)
    
    setZoomMult(down ? -Math.sign(clampY) * Math.abs(clampY / 10)**4 : 0)
    set({ y: down ? clampY : 0 })
    
  }, { event: { passive: false, capture: false }, domTarget: ref })
  
  React.useEffect(bind, [bind])

  return (
    <animated.div 
      ref={ref}
      // {...bind()}
      style={{
        transform: y.interpolate(y => `translate3D(0, ${y}px, 0)`),
        borderRadius: '50rem',
        // background: "hotpink",
        width: props.diameter,
        height: props.diameter,

        marginLeft: -props.diameter/2,
        marginTop: -props.diameter/2,
        top: "50%",
        left: "50%",
        position: "absolute",
        zIndex: "1",
      }} 
      >
      <Fab 
        onClick={ e => {
            // e.preventDefault();
            // console.log(y);
            console.log("fab click");
            if (y.getValue() === 0) {
              console.log("reset");
              reset();
            } else {
              console.log("moved - no resety");
            }
          }
        }
        style={{
          backgroundColor: "#2196f3",

          width: props.diameter,
          height: props.diameter,
        }}>
        <Typography style={{ color: "#fff" }}>
          <animated.div>
            {zoom.toFixed(1)}%
          </animated.div>
        </Typography>
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
                // console.log(e);
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