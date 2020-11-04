import { Button, Card, Grid, Grow, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { ChangeCoordinatesCardProps } from '../../common/info';
import { startPos, startTheta, startZoom } from '../../common/values';
import { warpToPoint } from '../../common/utils';

const ChangeCoordinatesCard = (props: ChangeCoordinatesCardProps): JSX.Element => {
  const [x, setX] = useState(startPos[0]);
  const [y, setY] = useState(startPos[1]);
  const [zoom, setZoom] = useState(startZoom);
  const [theta, setTheta] = useState(startTheta);

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
            type="number"
            defaultValue={x}
            inputProps={{ step: 0.01 }}
            label="x"
          />
          <TextField
            size="small"
            style={{ width: '12ch' }}
            onChange={(e) => setY(Number(e.target.value))}
            type="number"
            defaultValue={y}
            inputProps={{ step: 0.01 }}
            label="y"
          />
          <Grid container direction="row" justify="space-around">
            <TextField
              size="small"
              style={{ width: '5ch' }}
              onChange={(e) => setZoom(Number(e.target.value))}
              type="number"
              defaultValue={zoom}
              inputProps={{ min: 0 }}
              label="zoom"
            />
            <TextField
              size="small"
              style={{ width: '5ch' }}
              onChange={(e) => setTheta(Number(e.target.value))}
              type="number"
              defaultValue={theta}
              inputProps={{ step: 0.1 }}
              label="theta"
            />
          </Grid>
          <Button
            style={{ marginTop: 12 }}
            onClick={() =>
              warpToPoint(props.mandelbrot, { xy: [x, y], z: zoom, theta: theta })
            }
          >
            Go
          </Button>
        </Grid>
      </Card>
    </Grow>
  );
};

export default ChangeCoordinatesCard;
