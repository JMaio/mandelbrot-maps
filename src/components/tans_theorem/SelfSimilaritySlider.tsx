import { Card, Slider } from '@material-ui/core';
import React from 'react';
import { SelfSimilaritySliderProps } from '../../common/tans';

const gen = (x: number) => {
  const y = Math.abs(x) % 1;
  return x < 0 ? 1 - y : y;
};
const SelfSimilaritySlider = (props: SelfSimilaritySliderProps): JSX.Element => {
  const x =
    Math.log(props.magnification) /
    Math.log(props.focusedPointMandelbrot.selfSimilarityFactorMagnitude);
  const progress = gen(x);

  return (
    <Card>
      <Slider
        value={progress}
        min={0}
        max={1}
        track={false}
        orientation="horizontal"
        aria-labelledby="continuous-slider"
      />
    </Card>
  );
};

export default SelfSimilaritySlider;
