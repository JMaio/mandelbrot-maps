import React from 'react';
import { SelectMenuProps } from '../../common/tans';
import { Card, Button, Typography, Box } from '@material-ui/core';
import { KeyboardArrowLeft } from '@material-ui/icons';

export enum AnimationStatus {
  INTRO = -1,
  SELECT_MANDELBROT_POINT = 0,
  SELECT_JULIA_POINT = 1,
  ZOOM_M = 2,
  ZOOM_J = 3,
  ROTATE_M = 4,
  ROTATE_J = 5,
  PLAY = 6,
}

const AnimationFinalCard = (props: SelectMenuProps): JSX.Element => {
  return (
    <>
      {props.show ? (
        <Card
          style={{
            zIndex: 100,
            display: 'flex',
            flexDirection: 'row',
            flexShrink: 1,
            fontSize: '0.8rem',
          }}
        >
          <Button onClick={props.handleQuit}>
            <KeyboardArrowLeft />
            Back
          </Button>
          <div style={{ padding: 8, marginLeft: 12 }}>
            <Typography gutterBottom>You are now free to continue magnifying.</Typography>
            <Typography gutterBottom>
              <Box fontWeight="fontWeightBold" m={0} textAlign="left">
                higher magnification &#8594; stronger similarity
              </Box>
            </Typography>
          </div>
        </Card>
      ) : null}
    </>
  );
};

export default AnimationFinalCard;
