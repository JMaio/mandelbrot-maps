import { Select } from '@material-ui/core';
import React from 'react';
import { SimilarPointsListProps } from '../../common/tans';
import { formatComplexNumber, PreperiodicPoint } from './tansTheoremUtils';

const SimilarPointsList = (props: SimilarPointsListProps): JSX.Element => {
  const handleSimilarPointSelection = (event: React.ChangeEvent<{ value: unknown }>) => {
    const identifier = event.target.value as string;

    let chosen: PreperiodicPoint = props.similarPointsJulia[0];
    for (let i = 0; i < props.similarPointsJulia.length; i++) {
      if (props.similarPointsJulia[i].point.toString() === identifier) {
        chosen = props.similarPointsJulia[i];
        break;
      }
    }

    props.handleSimilarPointSelection(chosen);
  };

  return (
    <Select
      native
      value={props.focusedPointJulia.point}
      onChange={handleSimilarPointSelection}
    >
      {props.similarPointsJulia.map((m) => (
        <option key={m.point.toString()} value={m.point.toString()}>
          {formatComplexNumber(m.point)}
        </option>
      ))}
    </Select>
  );
};

export default SimilarPointsList;
