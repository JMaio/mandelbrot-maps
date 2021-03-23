import { Button, Card, Grid, Typography, Box } from '@material-ui/core';
import React from 'react';
import { IntroCardProps } from '../../common/tans';
import { AnimationStatus } from './AnimationFinalCard';

const IntroCard = (props: IntroCardProps): JSX.Element => {
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
          setAnimationState(AnimationStatus.SELECT_MANDELBROT_POINT);
        }}
      >
        START
      </Button>
    );
  };

  return (
    <Card
      style={{
        padding: 12,
        zIndex: 1400,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 1,
        marginBottom: 8,
      }}
    >
      <Grid container direction="column">
        <Grid container direction="row">
          <Grid item>{props.quitButton()}</Grid>
          <Grid item>
            <Typography
              style={{
                marginBottom: 8,
              }}
              variant="h6"
              gutterBottom
            >
              Welcome to the Tans theorem explorer!
            </Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Typography
            style={{
              marginBottom: 8,
            }}
            gutterBottom
          >
            Tan&apos;s theorem states that, at particular points, the Mandelbrot set and
            Julia sets are almost{' '}
            <Box fontWeight="fontWeightBold" m={0} display="inline">
              indistinguishable
            </Box>
            .
          </Typography>
          <Typography
            style={{
              marginBottom: 8,
            }}
            gutterBottom
          >
            This mode will take you through the process of selecting a point on each set,
            then magnifying and rotating them to best show the similarity.
          </Typography>
          <Typography
            style={{
              marginBottom: 8,
            }}
            gutterBottom
          >
            Simply press START, then follow the steps provided.
          </Typography>
        </Grid>
      </Grid>
      {goButton(props.setAnimationState)}
    </Card>
  );
};

export default IntroCard;
