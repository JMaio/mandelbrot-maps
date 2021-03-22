import { Button, Card, Grow, Typography, Grid } from '@material-ui/core';
import React from 'react';
import { MisiurewiczDomainsMenuProps } from '../../common/tans';
import { AnimationStatus } from './AnimationFinalCard';
import { warpToPoint } from '../../common/utils';

const MisiurewiczDomainsMenu = (props: MisiurewiczDomainsMenuProps): JSX.Element => {
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

        {goButton(props.setAnimationState)}
      </Card>
    </Grow>
  );
};

export default MisiurewiczDomainsMenu;
