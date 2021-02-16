import { Button, Card, Grid, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { ChangeCoordinatesCardProps } from '../../common/info';
import { warpToPoint } from '../../common/utils';
import { defaultMandelbrotStart } from '../../common/values';

const ChangeCoordinatesCard = ({
  precision,
  ...props
}: ChangeCoordinatesCardProps): JSX.Element => {
  const [xy, setXY] = useState(defaultMandelbrotStart.xy);
  const [x, y] = xy;
  const [zoom, setZoom] = useState(defaultMandelbrotStart.z);
  const [theta, setTheta] = useState(defaultMandelbrotStart.theta);

  return (
    <Card
      style={{
        width: 'auto',
        zIndex: 1300,
        position: 'relative',
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 1,
        // borderRadius: 100,
      }}
    >
      <Grid container direction="column" alignItems="center">
        <TextField
          size="small"
          style={{ width: '12ch' }}
          onChange={(e) => setXY(([x, y]) => [Number(e.target.value), y])}
          type="number"
          defaultValue={x}
          inputProps={{ step: 0.01 }}
          label="x"
        />
        <TextField
          size="small"
          style={{ width: '12ch' }}
          onChange={(e) => setXY(([x, y]) => [x, Number(e.target.value)])}
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
            warpToPoint(props.mandelbrot, { xy: xy, z: zoom, theta: theta }, precision)
          }
        >
          Go
        </Button>
      </Grid>
    </Card>
  );
};

export default ChangeCoordinatesCard;
