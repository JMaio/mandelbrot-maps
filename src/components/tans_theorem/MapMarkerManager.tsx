import React, { useEffect, useState } from 'react';
import { MarkerManagerProps } from '../../common/tans';
import { XYType, ViewerControlSprings } from '../../common/types';
import ComplexNumberMarker from './ComplexNumberMarker';
import { PreperiodicPoint } from './tansTheoremUtils';

const MAX_MARKERS = 8;

/**
 * Check if a point is within a given "bounding" box.
 *
 * @param {p} A point.
 * @param {boxCentre} The centre of the box.
 * @param {boxWidth} The width of the box.
 * @param {boxHeight} The height of the box.
 * @param {boxAngle} The angle the box makes with the x-axis.
 */
const withinBoundingBox = (
  p: XYType,
  boxCentre: XYType,
  boxWidth: number,
  boxHeight: number,
  boxAngle: number,
): boolean => {
  const dx = p[0] - boxCentre[0];
  const dy = p[1] - boxCentre[1];

  const horizontalDistance: number = Math.abs(
    dx * Math.cos(boxAngle) - dy * Math.sin(boxAngle),
  );
  const verticalDistance: number = Math.abs(
    dx * Math.sin(boxAngle) + dy * Math.cos(boxAngle),
  );

  return horizontalDistance < boxWidth && verticalDistance < boxHeight;
};

export const generateMarkers = (
  viewerControls: ViewerControlSprings,
  focusedPoint: PreperiodicPoint,
  aspectRatio: number,
  onClick: (x: PreperiodicPoint) => void,
  points: PreperiodicPoint[],
): JSX.Element[] => {
  const mapMarkers = [];

  const boxCentre = viewerControls.xyCtrl[0].xy.getValue();
  const boxWidth = 1 / (aspectRatio * viewerControls.zoomCtrl[0].z.getValue());
  const boxHeight = 1 / viewerControls.zoomCtrl[0].z.getValue();
  const boxAngle = viewerControls.rotCtrl[0].theta.getValue();
  if (withinBoundingBox(focusedPoint.point, boxCentre, boxWidth, boxHeight, boxAngle)) {
    mapMarkers.push(
      <ComplexNumberMarker
        key={focusedPoint.point.toString()}
        m={focusedPoint}
        aspectRatio={aspectRatio}
        viewerControl={viewerControls}
        onClick={() => onClick(focusedPoint)}
        isFocused={true}
      />,
    );
  }

  for (let i = 0; i < points.length; i++) {
    if (mapMarkers.length === MAX_MARKERS) break;
    if (
      points[i] !== focusedPoint &&
      withinBoundingBox(points[i].point, boxCentre, boxWidth, boxHeight, boxAngle)
    ) {
      mapMarkers.push(
        <ComplexNumberMarker
          key={points[i].point.toString()}
          m={points[i]}
          aspectRatio={aspectRatio}
          viewerControl={viewerControls}
          onClick={() => onClick(points[i])}
          isFocused={false}
        />,
      );
    }
  }
  return mapMarkers;
};

const MapMarkerManager = (props: MarkerManagerProps): JSX.Element => {
  const [markers, setMarkers] = useState([<div key={0} />]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (props.show) {
        setMarkers(
          generateMarkers(
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
  }, [props.aspectRatio, props.focusedPoint, props.setter, props.show, props.points]);

  return <>{props.show ? markers : null}</>;
};

export default MapMarkerManager;
