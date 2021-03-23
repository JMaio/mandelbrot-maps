import { Select } from '@material-ui/core';
import React from 'react';
import { PointsListProps } from '../../common/tans';
import { PreperiodicPoint } from './tansTheoremUtils';

const PointsList = (props: PointsListProps): JSX.Element => {
  const handleSimilarPointSelection = (event: React.ChangeEvent<{ value: unknown }>) => {
    const identifier = event.target.value as string;

    let chosen: PreperiodicPoint = props.points[0];
    for (let i = 0; i < props.points.length; i++) {
      if (props.points[i].point.toString() === identifier) {
        chosen = props.points[i];
        break;
      }
    }

    props.handleSelection(chosen);
  };

  return (
    <Select
      native
      value={props.focusedPoint.point.toString()}
      onChange={handleSimilarPointSelection}
    >
      {props.points.map((m) => (
        <option key={m.point.toString()} value={m.point.toString()}>
          {props.displayText(m)}
        </option>
      ))}
    </Select>
  );
};

export default PointsList;
