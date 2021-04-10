import { Card, Grow, Button } from '@material-ui/core';
import React from 'react';
import { SelectMenuProps } from '../../common/tans';
import { KeyboardArrowRight } from '@material-ui/icons';

const PointsInfoCard = (props: SelectMenuProps): JSX.Element => {
  return (
    <Grow in={props.show}>
      <Card
        style={{
          zIndex: 1400,
          display: 'flex',
          flexDirection: 'row',
          flexShrink: 1,
        }}
      >
        <Button color="secondary" onClick={props.handleQuit}>
          Quit
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
