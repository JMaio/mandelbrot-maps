import { Card, Button } from '@material-ui/core';
import React from 'react';
import { NearestMisiurewiczCardProps } from '../../common/tans';

const NearestMisiurewiczCard = (props: NearestMisiurewiczCardProps): JSX.Element => {
  return (
    <Card>
      <Button color="primary" onClick={props.onClick} style={{ width: '100%' }}>
        Press me to find a nearby Misiurewicz point
      </Button>
    </Card>
  );
};

export default NearestMisiurewiczCard;
