import { Select } from '@material-ui/core';
import React from 'react';
import { MisiurewiczPointsListProps } from '../../common/tans';
import { warpToPoint } from '../../common/utils';
import { formatComplexNumber, PreperiodicPoint } from './tansTheoremUtils';
import { MISIUREWICZ_POINTS } from './AnimationFinalCard';

const MisiurewiczPointsList = (props: MisiurewiczPointsListProps): JSX.Element => {
  const handleMandelbrotPointSelection = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    const identifier = event.target.value as string;

    let chosenMisiurewicz: PreperiodicPoint = MISIUREWICZ_POINTS[0];
    for (let i = 0; i < MISIUREWICZ_POINTS.length; i++) {
      if (MISIUREWICZ_POINTS[i].point.toString() === identifier) {
        chosenMisiurewicz = MISIUREWICZ_POINTS[i];
        break;
      }
    }

    props.handleMandelbrotSelection(chosenMisiurewicz);
    warpToPoint(props.mandelbrot, {
      xy: chosenMisiurewicz.point,
      z: chosenMisiurewicz.factorMagnitude,
      theta: 0,
    });
  };

  return (
    <Select
      native
      value={props.focusedPoint.point}
      onChange={handleMandelbrotPointSelection}
      inputProps={{
        name: 'mandelbrot',
        id: 'select-multiple-native',
      }}
    >
      {MISIUREWICZ_POINTS.map((m) => (
        <option key={m.toString()} value={m.point.toString()}>
          {m.toString()} = {formatComplexNumber(m.point)}
        </option>
      ))}
    </Select>
  );
};

export default MisiurewiczPointsList;
