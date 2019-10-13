import React, { Fragment } from 'react';
import './App.css';
import { Grid } from '@material-ui/core';
import ZoomBar, { } from './components/ZoomBar';
import RotationControl from './components/RotationControl';

import 'typeface-roboto';
import MandelbrotRenderer from './components/MandelbrotRenderer.jsx';


function App() {

  return (
    <Fragment>
      <MandelbrotRenderer
        style={{
          position: 'absolute',
          zIndex: 0,
        }}
      />
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
      </Grid>
    </Fragment>
  );
}

export default App;
