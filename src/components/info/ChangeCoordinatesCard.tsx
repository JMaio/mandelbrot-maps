import { Box, Button, Card, Grow, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { ChangeCoordinatesCardProps } from '../../common/info';
import {
  resetPosSpringConfig,
  resetZoomSpringConfig,
  startPos,
  startZoom,
} from '../../App';
import { vScale } from 'vec-la-fp';

const ChangeCoordinatesCard = (props: ChangeCoordinatesCardProps): JSX.Element => {
  const [x, setX] = useState(startPos[0]);
  const [y, setY] = useState(startPos[1]);
  const [zoom, setZoom] = useState(startZoom);

  const go = () => {
    props.mandelbrot.xyCtrl[1]({
      xy: vScale(1 / props.screenScaleMultiplier, [x, y]),
      config: resetPosSpringConfig,
    });
    props.mandelbrot.zoomCtrl[1]({
      zoom: zoom,
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
        <Box>
          <TextField
            size="small"
            style={{ width: 100 }}
            onChange={(e) => setX(Number(e.target.value))}
            value={x}
            label="x"
          />
        </Box>
        <Box>
          <TextField
            size="small"
            style={{ width: 100 }}
            onChange={(e) => setY(Number(e.target.value))}
            value={y}
            label="y"
          />
        </Box>
        <Box>
          <TextField
            size="small"
            style={{ width: 100 }}
            onChange={(e) => setZoom(Number(e.target.value))}
            value={zoom}
            label="zoom"
          />
        </Box>
        <Button style={{ marginTop: 12 }} onClick={() => go()}>
          Go
        </Button>
      </Card>
    </Grow>
  );
};

export default ChangeCoordinatesCard;
