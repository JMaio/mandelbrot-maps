import { Button, Card, Grid, Grow, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { vScale } from 'vec-la-fp';
import {
  resetPosSpringConfig,
  resetZoomSpringConfig,
  startPos,
  startTheta,
  startZoom,
} from '../../App';
import { ChangeCoordinatesCardProps } from '../../common/info';

const ChangeCoordinatesCard = (props: ChangeCoordinatesCardProps): JSX.Element => {
  const [x, setX] = useState(startPos[0]);
  const [y, setY] = useState(startPos[1]);
  const [zoom, setZoom] = useState(startZoom);
  const [theta, setTheta] = useState(startTheta);

  const go = () => {
    props.mandelbrot.xyCtrl[1]({
      xy: vScale(1 / props.screenScaleMultiplier, [x, y]),
      config: resetPosSpringConfig,
    });
    props.mandelbrot.zoomCtrl[1]({
      zoom: zoom,
      config: resetZoomSpringConfig,
    });
    props.mandelbrot.rotCtrl[1]({
      theta: theta,
      config: resetZoomSpringConfig,
    });
  };

  return (
    <Grow in={props.show}>
      <Card
        style={{
          width: 'auto',
          zIndex: 1300,
          position: 'relative',
          padding: 8,
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 1,
          // display: props.show ? 'block' : 'none',
          // borderRadius: 100,
        }}
      >
        <Grid container direction="column" alignItems="center">
          <TextField
            size="small"
            style={{ width: '12ch' }}
            onChange={(e) => setX(Number(e.target.value))}
            value={x}
            label="x"
          />
          <TextField
            size="small"
            style={{ width: '12ch' }}
            onChange={(e) => setY(Number(e.target.value))}
            value={y}
            label="y"
          />
          <Grid container direction="row" justify="space-around">
            <TextField
              size="small"
              style={{ width: '5ch' }}
              onChange={(e) => setZoom(Number(e.target.value))}
              value={zoom}
              label="zoom"
            />
            <TextField
              size="small"
              style={{ width: '3ch' }}
              onChange={(e) => setTheta(Number(e.target.value))}
              value={theta}
              label="theta"
            />
          </Grid>
          <Button style={{ marginTop: 12 }} onClick={() => go()}>
            Go
          </Button>
        </Grid>
      </Card>
    </Grow>
  );
};

export default ChangeCoordinatesCard;
