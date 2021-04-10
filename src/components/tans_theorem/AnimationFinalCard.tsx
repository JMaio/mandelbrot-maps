import React from 'react';
import { AnimationFinalCardProps } from '../../common/tans';
import { Card, Button, Typography, Box } from '@material-ui/core';
import { KeyboardArrowLeft } from '@material-ui/icons';
import SelfSimilaritySlider from './SelfSimilaritySlider';

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

const AnimationFinalCard = (props: AnimationFinalCardProps): JSX.Element => {
  return (
    <>
      {props.show ? (
        <Card
          style={{
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 1,
            fontSize: '0.8rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexShrink: 1,
            }}
          >
            <Button onClick={props.handleQuit}>
              <KeyboardArrowLeft />
              Back
            </Button>
            <div style={{ padding: 8, marginLeft: 12 }}>
              <Typography gutterBottom>
                You are now free to continue magnifying.
              </Typography>
              <Typography gutterBottom>
                <Box fontWeight="fontWeightBold" m={0} textAlign="left">
                  higher magnification &#8594; stronger similarity
                </Box>
              </Typography>
            </div>
          </div>
          {props.rotateWhileZooming ? (
            <SelfSimilaritySlider
              focusedPointMandelbrot={props.focusedPointMandelbrot}
              magnification={props.magnification}
            />
          ) : null}
        </Card>
      ) : null}
    </>
  );
};

export default AnimationFinalCard;
