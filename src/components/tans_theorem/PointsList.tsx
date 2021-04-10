import { Select } from '@material-ui/core';
import React from 'react';
import { PointsListProps } from '../../common/tans';

const PointsList = (props: PointsListProps): JSX.Element => {
  const handleSimilarPointSelection = (event: React.ChangeEvent<{ value: unknown }>) => {
    const identifier = event.target.value as number;

    props.handleSelection(props.points[identifier]);
  };

  return (
    <Select
      native
      value={props.points.indexOf(props.focusedPoint)}
      onChange={handleSimilarPointSelection}
    >
      {props.points.map((currElement, i) => (
        <option key={i} value={i}>
          {props.displayText(currElement)}
        </option>
      ))}
    </Select>
  );
};

export default PointsList;
