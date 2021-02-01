import { Card, Grid, Typography, Grow } from '@material-ui/core';
import React from 'react';
import { XYType } from '../../common/types';
import { formatComplexNumber } from '../../common/complex_number_helper';
import { MAX_ORBIT_LENGTH } from './OrbitPlotter';

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
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 1300,
          padding: '4px 12px',
        }}
      >
        <Typography component="span" variant="h6">
          Orbit for {formatComplexNumber(props.currentPoint)}
        </Typography>
        {props.prePeriod !== -1 ? (
          <>
            <Grid id="top-row" container>
              <Grid item xs>
                <Typography component="span" variant="body1" color="textSecondary">
                  Preperiod
                </Typography>
              </Grid>
              <Grid item xs>
                <Typography component="span" variant="body1" color="textPrimary">
                  {props.prePeriod}
                </Typography>
              </Grid>
            </Grid>
            <Grid id="bottom-row" container>
              <Grid item xs>
                <Typography component="span" variant="body1" color="textSecondary">
                  Period
                </Typography>
              </Grid>
              <Grid item xs>
                <Typography component="span" variant="body1" color="textPrimary">
                  {props.period}
                </Typography>
              </Grid>
            </Grid>
          </>
        ) : (
          <Grid id="top-row" container>
            <Typography component="span" variant="body1" color="textPrimary">
              Did not reach a cycle after {MAX_ORBIT_LENGTH} iterations
            </Typography>
          </Grid>
        )}
      </Card>
    </Grow>
  );
};

export default OrbitCard;
