import { Button, Card, Grow, Typography, Grid } from '@material-ui/core';
import React from 'react';
import { InfoCardProps } from '../../common/tans';
import { AnimationStatus, MISIUREWICZ_POINTS } from './AnimationFinalCard';
import PointsList from './PointsList';
import { warpToPoint } from '../../common/utils';
import { PreperiodicPoint, formatComplexNumber } from './tansTheoremUtils';

const PointsInfoCard = (props: InfoCardProps): JSX.Element => {
  const goButton = (
    setAnimationState: React.Dispatch<React.SetStateAction<AnimationStatus>>,
  ) => {
    return (
      <Button
        variant="contained"
        style={{
          float: 'right',
        }}
        onClick={() => {
          setAnimationState(AnimationStatus.SELECT_JULIA_POINT);
          warpToPoint(props.mandelbrot, {
            xy: props.focusedPointMandelbrot.point,
            z: 1,
            theta: 0,
          });
          warpToPoint(props.julia, {
            xy: [0, 0],
            z: 0.5,
            theta: 0,
          });
        }}
      >
        CONFIRM
      </Button>
    );
  };

  const handleSelection = (c: PreperiodicPoint) => {
    props.handleMandelbrotSelection(c);
    warpToPoint(props.mandelbrot, {
      xy: c.point,
      z: c.factorMagnitude,
      theta: 0,
    });
  };

  return (
    <Grow in={props.show}>
      <Card
        style={{
          padding: 12,
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 1,
          marginBottom: 8,
        }}
      >
        <Grid container>
          <Grid item>{props.quitButton()}</Grid>
          <Grid item>
            <Typography
              style={{
                marginBottom: 8,
              }}
              variant="h6"
              gutterBottom
            >
              Pick a point in the Mandelbrot set!
            </Typography>
          </Grid>
        </Grid>
        <PointsList
          focusedPoint={props.focusedPointMandelbrot}
          points={MISIUREWICZ_POINTS}
          displayText={(c) => `${c.toString()} = ${formatComplexNumber(c.point)}`}
          handleSelection={handleSelection}
        />
        {goButton(props.setAnimationState)}
      </Card>
    </Grow>
  );
};

export default PointsInfoCard;
