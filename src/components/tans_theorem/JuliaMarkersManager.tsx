import React, { useEffect, useState } from 'react';
import { JuliaManagerProps } from '../../common/tans';
import { generateJuliaMarkers } from './tansTheoremUtils';

const JuliaMarkersManager = (props: JuliaManagerProps): JSX.Element => {
  const [markers, setMarkers] = useState([<div key={0} />]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (props.show) {
        setMarkers(
          generateJuliaMarkers(
            props.viewerControls,
            props.focusedPoint,
            props.aspectRatio,
            props.setter,
            props.similarPointsJulia,
          ),
        );
      }
    }, 10);
    return () => clearInterval(interval);
    // explicitly not adding mandelbrotControls to the deps list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.aspectRatio,
    props.focusedPoint,
    props.setter,
    props.similarPointsJulia,
    props.show,
  ]);

  return <>{props.show ? markers : null}</>;
};

export default JuliaMarkersManager;
