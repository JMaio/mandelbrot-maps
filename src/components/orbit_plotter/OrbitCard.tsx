import { Card, Grid, Typography, Grow } from '@material-ui/core';
import React from 'react';
import { XYType } from '../../common/types';
import { formatComplexNumber } from '../../common/complex_number_helper';

type OrbitCardProps = {
  show: boolean;
  currentPoint: XYType;
  prePeriod: number;
  period: number;
};

const OrbitCard = (props: OrbitCardProps): JSX.Element => {
  return (
    <Grow in={props.show}>
      <Card
        style={{
          width: 'auto',
          zIndex: 1300,
          padding: 8,
          display: 'flex',
          flexDirection: 'column',
          position: 'absolute',
          left: 0,
          top: 0,
        }}
      >
        <Typography component="span" variant="h6">
          Orbit for {formatComplexNumber(props.currentPoint)}
        </Typography>
        {props.prePeriod !== -1 ? (
          <>
            <Grid id="top-row" container spacing={8}>
              <Grid item xs={4}>
                <Typography component="span" variant="body1" color="textSecondary">
                  Preperiod
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography component="span" variant="body1" color="textPrimary">
                  {props.prePeriod}
                </Typography>
              </Grid>
            </Grid>
            <Grid id="bottom-row" container spacing={8}>
              <Grid item xs={4}>
                <Typography component="span" variant="body1" color="textSecondary">
                  Period
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography component="span" variant="body1" color="textPrimary">
                  {props.period}
                </Typography>
              </Grid>
            </Grid>
          </>
        ) : (
          <Typography component="span" variant="body1" color="textPrimary">
            divergent
          </Typography>
        )}
      </Card>
    </Grow>
  );
};

export default OrbitCard;
