import React, { useEffect, useState } from 'react';
import { MandelbrotManagerProps } from '../../common/tans';
import { generateMandelbrotMarkers } from './tansTheoremUtils';
import { MISIUREWICZ_POINTS } from './AnimationFinalCard';

const MisiurewiczMarkersManager = (props: MandelbrotManagerProps): JSX.Element => {
  const [markers, setMarkers] = useState([<div key={0} />]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (props.show) {
        setMarkers(
          generateMandelbrotMarkers(
            props.viewerControls,
            props.focusedPoint,
            props.aspectRatio,
            props.setter,
            MISIUREWICZ_POINTS,
            props.shadeMisiurewiczDomains,
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
    props.shadeMisiurewiczDomains,
    props.show,
  ]);

  return <>{props.show ? markers : null}</>;
};

export default MisiurewiczMarkersManager;
