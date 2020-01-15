import React from "react";
import { Slider } from "@material-ui/core";

export default function IterationSlider(props) {

  return (
    <Slider
      defaultValue={props.maxIter}
      valueLabelDisplay="on"
      step={1}
      min={1}
      max={300}
      style={{
        width: 200,
        margin: 30,
      }}
      onChange={(e, v) => props.setMaxIter(v)}
    />
  )
}