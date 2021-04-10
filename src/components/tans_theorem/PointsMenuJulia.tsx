import { Card, Grow, Button } from '@material-ui/core';
import React from 'react';
import { SelectMenuProps } from '../../common/tans';
import { KeyboardArrowRight } from '@material-ui/icons';
import { KeyboardArrowLeft } from '@material-ui/icons';

const PointsInfoCard = (props: SelectMenuProps): JSX.Element => {
  return (
    <Grow in={props.show}>
      <Card
        style={{
          zIndex: 1400,
          display: 'flex',
          flexDirection: 'row',
          flexShrink: 1,
          marginBottom: 8,
        }}
      >
        <Button onClick={props.handleQuit}>
          <KeyboardArrowLeft />
          Back
        </Button>
        <div style={{ width: '100%' }}>
          <Button style={{ float: 'right' }} onClick={props.handleGo}>
            CONFIRM
            <KeyboardArrowRight />
          </Button>
        </div>
      </Card>
    </Grow>
  );
};

export default PointsInfoCard;
