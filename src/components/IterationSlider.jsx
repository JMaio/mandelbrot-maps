import React from "react";
import { Slider } from "@material-ui/core";

export default function IterationSlider(props) {


  let [maxI, setMaxI] = props.maxiter;
  
  return (
    <Slider
      defaultValue={maxI}
      valueLabelDisplay="on"
      step={1}
      min={1}
      max={300}
      style={{
        width: 200,
        margin: 30,
      }}
      onChange={(e, v) => setMaxI(v)}
      {...props}
    />
  )
}