import { Slider } from '@material-ui/core';
import React from 'react';
import { PlayCardProps } from '../../common/tans';

const gen = (x: number) => {
  const y = Math.abs(x) % 1;
  return x < 0 ? 1 - y : y;
};
const PlayCard = (props: PlayCardProps): JSX.Element => {
  const x =
    Math.log(props.magnification) /
    Math.log(props.focusedPointMandelbrot.selfSimilarityFactorMagnitude);
  const progress = gen(x);

  return (
    <Slider
      value={progress}
      style={{
        height: '60vh',
      }}
      min={0}
      max={1}
      track={false}
      orientation="vertical"
      aria-labelledby="continuous-slider"
    />
  );
};

export default PlayCard;
