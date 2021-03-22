import React from 'react';
import { AnimationFinalCardProps } from '../../common/tans';
import { Card, Grid, IconButton, Typography, Box } from '@material-ui/core';
import { PreperiodicPoint } from './tansTheoremUtils';
import { misiurewiczPairs } from './MPoints';
import ArrowBackwardIcon from '@material-ui/icons/ArrowBack';

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

export const MISIUREWICZ_POINTS: PreperiodicPoint[] = misiurewiczPairs
  .slice(0, 200)
  .map((p) => new PreperiodicPoint(p, p, false))
  .sort((a, b) => a.factorMagnitude - b.factorMagnitude);

const AnimationFinalCard = (props: AnimationFinalCardProps): JSX.Element => {
  const BackButton = () => {
    return (
      <IconButton style={{ width: 50 }} onClick={props.handleReset}>
        <ArrowBackwardIcon />
      </IconButton>
    );
  };

  return (
    <>
      {props.animationState === AnimationStatus.PLAY ? (
        <Card
          style={{
            padding: 12,
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 1,
            fontSize: '0.8rem',
          }}
        >
          <Grid container direction="row">
            <Grid item>{BackButton()}</Grid>
            <Grid item>
              <Typography gutterBottom>
                You are now free to continue magnifying.
              </Typography>
              <Typography gutterBottom>
                <Box fontWeight="fontWeightBold" m={0} textAlign="left">
                  higher magnification &#8594; stronger similarity
                </Box>
              </Typography>
            </Grid>
          </Grid>
        </Card>
      ) : null}
    </>
  );
};

export default AnimationFinalCard;
