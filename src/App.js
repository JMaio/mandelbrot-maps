import React, { Fragment } from 'react';
import logo from './logo.svg';
import './App.css';
import { Typography, Button, Card, CardContent, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, CardActionArea, CardMedia, Fab, Paper, Grid, GridList, GridListTile, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { width } from '@material-ui/system';
import { ReactComponent as PlusIcon } from './plus-icon.svg';
import { ReactComponent as MinusIcon } from './minus-icon.svg';
import Draggable from 'react-draggable';
import ZoomBar, { ZoomBarF, ZoomBarPaper } from './components/ZoomBar';
import RotationControl, { RotationControlFun } from './components/RotationControl';

import 'typeface-roboto';
import MandelbrotRenderer from './components/MandelbrotRenderer.jsx';

function Welcome(props) {
  return (
    <h1>Hello, {props.name}</h1>
  );
}

class ThingCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };

    this.toggleOpen = this.toggleOpen.bind(this);
  }

  toggleOpen() {
    this.setState((state, props) => ({
      open: !state.open
    }))
  }

  render() {
    return (
      <Card style={{
        width: "100%"
      }}>
        <CardActionArea onClick={this.toggleOpen}>
          <CardMedia
            image="https://material-ui.com/static/images/cards/contemplative-reptile.jpg"
            title="Contemplative Reptile"
            style={{
              height: "140px"
            }}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Lizard is {this.state.open ? "open" : "closed"}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p" hidden={!this.state.open}>
              Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
              across all continents except Antarctica
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    )
  }
}

function Separator() {
  return (
    <div
      style= {{
        margin: 10,
      }}
    />
  )
}

function App() {
  let user = {
    first: "J",
    last: "wow"
  }

  // app should contain all current values (x, y, zoom, orientation)


  // let springs = [
  //   [30, 300],
  //   [30, 600],
  //   // [50, 400],
  //   // [25, 800],
  //   [40, 500],
  //   [40, 600],
  //   [40, 800],
  //   // [55, 800],
  // ]

  return (
    <Fragment>
      <MandelbrotRenderer 
        style={{
          position: 'absolute',
          zIndex: 0,
        }} 
      />
      {/* <canvas 
        id="mandelbrot"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      /> */}

      <Grid 
        className="App"
        container
        direction="column"
        justify="space-around"
        alignItems="center"
        style={{
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      >

        <Grid 
          container
          direction="row"
          justify="flex-end"
          alignItems="center">
          <ZoomBar />
        </Grid>
        
        
        <RotationControl />
        
        
        {/* <RotationControlFun />

        <Fab onClick={ e => {
          console.log("click")
        }}>
          Hello
        </Fab> */}

      </Grid>
    </Fragment>
  );
}

export default App;
