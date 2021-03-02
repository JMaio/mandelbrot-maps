import { Card, Grow } from '@material-ui/core';
import React from 'react';
import { animated } from 'react-spring';
import { FPSCardProps } from '../../common/info';

const FPSCard = (props: FPSCardProps): JSX.Element => (
  <Grow in={props.show}>
    <Card
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        padding: '4px 12px',
        margin: 6,
        fontFamily: 'monospace',
        borderRadius: 100,
        fontSize: '1.8rem',
        zIndex: 1300,
        userSelect: 'none',
      }}
    >
      <animated.div>{props.FPS}</animated.div>
    </Card>
  </Grow>
);

export default FPSCard;
