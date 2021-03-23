import React, { useEffect, useState } from 'react';
import { MarkerManagerProps } from '../../common/tans';

const MapMarkerManager = (props: MarkerManagerProps): JSX.Element => {
  const [markers, setMarkers] = useState([<div key={0} />]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (props.show) {
        setMarkers(
          props.generator(
            props.viewerControls,
            props.focusedPoint,
            props.aspectRatio,
            props.setter,
            props.points,
          ),
        );
      }
    }, 10);
    return () => clearInterval(interval);
    // explicitly not adding viewerControls to the deps list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.aspectRatio, props.focusedPoint, props.setter, props.show]);

  return <>{props.show ? markers : null}</>;
};

export default MapMarkerManager;
