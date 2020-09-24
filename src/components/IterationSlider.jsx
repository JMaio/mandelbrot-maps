import React from 'react';
import { Slider } from '@material-ui/core';

export default function IterationSlider(props) {
  let [maxI, setMaxI] = props.maxiter;

  return (
    <Slider
      value={maxI}
      valueLabelDisplay="on"
      step={2}
      min={3}
      max={500}
      style={{
        width: 200,
        margin: 30,
      }}
      onChange={(e, v) => setMaxI(v)}
      {...props}
    />
  );
}
