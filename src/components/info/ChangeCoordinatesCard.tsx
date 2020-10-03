import { Box, Button, Card, Grow, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { ChangeCoordinatesCardProps } from '../../common/info';
import { resetPosSpringConfig } from '../../App';
import { vScale } from 'vec-la-fp';

const ChangeCoordinatesCard = (props: ChangeCoordinatesCardProps): JSX.Element => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const go = () => {
    props.mandelbrot.xyCtrl[1]({
      xy: vScale(1 / props.screenScaleMultiplier, [x, y]),
      config: resetPosSpringConfig,
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
          // display: props.show ? 'block' : 'none',
          // borderRadius: 100,
        }}
      >
        <Box>
          <TextField
            size="small"
            style={{ width: 100 }}
            onChange={(e) => setX(Number(e.target.value))}
          />{' '}
          : x
        </Box>
        <Box>
          <TextField
            size="small"
            style={{ width: 100 }}
            onChange={(e) => setY(Number(e.target.value))}
          />{' '}
          : y
        </Box>
        <Button style={{ marginTop: 12 }} onClick={() => go()}>
          Go
        </Button>
      </Card>
    </Grow>
  );
};

export default ChangeCoordinatesCard;
