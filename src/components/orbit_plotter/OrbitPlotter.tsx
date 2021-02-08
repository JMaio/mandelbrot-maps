import React, { Component } from 'react';
import { forwardOrbit } from '../../common/complex_number_helper';
import { ViewerControlSprings, XYType } from '../../common/types';
import OrbitCard from './OrbitCard';
import OrbitMarker from './OrbitMarker';

type OrbitManagerState = {
  currentPoint: XYType;
  period: number;
  prePeriod: number;
  orbitMarkers: JSX.Element[];
};

type OrbitPlotterProps = {
  show: boolean;
  mandelbrot: ViewerControlSprings;
  rendererWidth: number;
  rendererHeight: number;
};

/**
 * Check if a point is within a given "bounding" box.
 *
 * @param {p} A point.
 * @param {boxCentre} The centre of the box.
 * @param {boxWidth} The width of the box.
 * @param {boxHeight} The height of the box.
 * @param {boxAngle} The angle the box makes with the x-axis.
 */
const withinBoundBox = (
  p: XYType,
  boxCentre: XYType,
  boxWidth: number,
  boxHeight: number,
  boxAngle: number,
): boolean => {
  const distanceX = p[0] - boxCentre[0];
  const distanceY = p[1] - boxCentre[1];

  const horizontalDistance: number = Math.abs(
    distanceX * Math.cos(-boxAngle) - distanceY * Math.sin(-boxAngle),
  );
  const verticalDistance: number = Math.abs(
    distanceX * Math.sin(-boxAngle) + distanceY * Math.cos(-boxAngle),
  );

  return horizontalDistance < boxWidth && verticalDistance < boxHeight;
};

export const MAX_ORBIT_LENGTH = 70;
const ORBIT_REFRESH_TIME = 50;

const COLOUR_PERIODIC = '#EE0000';
const COLOUR_PREPERIODIC = '#EEEE00';

export class OrbitPlotter extends Component<OrbitPlotterProps, OrbitManagerState> {
  constructor(props: OrbitPlotterProps) {
    super(props);
    this.state = {
      currentPoint: [0, 0],
      prePeriod: -1,
      period: -1,
      orbitMarkers: [],
    };
    setInterval(() => this.tick(), ORBIT_REFRESH_TIME);
  }

  tick(): void {
    const [orbit, prePeriod, period] = forwardOrbit(
      this.props.mandelbrot.xyCtrl[0].xy.getValue(),
      this.props.mandelbrot.xyCtrl[0].xy.getValue(),
      MAX_ORBIT_LENGTH,
    );

    const aspect_ratio = this.props.rendererWidth / this.props.rendererHeight;

    const orbitMarkers: JSX.Element[] = [];
    for (let i = 0; i < orbit.length; i++) {
      const color = i + 1 > orbit.length - period ? COLOUR_PERIODIC : COLOUR_PREPERIODIC;
      orbitMarkers.push(
        <OrbitMarker
          key={orbit[i].toString()}
          point={orbit[i]}
          rendererWidth={this.props.rendererWidth}
          rendererHeight={this.props.rendererHeight}
          mandelbrotControl={this.props.mandelbrot}
          color={color}
          show={withinBoundBox(
            orbit[i],
            this.props.mandelbrot.xyCtrl[0].xy.getValue(),
            aspect_ratio / this.props.mandelbrot.zoomCtrl[0].z.getValue(),
            1 / this.props.mandelbrot.zoomCtrl[0].z.getValue(),
            -this.props.mandelbrot.rotCtrl[0].theta.getValue(),
          )}
        />,
      );
    }
    this.setState({
      currentPoint: this.props.mandelbrot.xyCtrl[0].xy.getValue(),
      prePeriod: prePeriod,
      period: period,
      orbitMarkers: orbitMarkers,
    });
  }

  render(): JSX.Element {
    return (
      <>
        {this.props.show ? this.state.orbitMarkers : null}
        <OrbitCard
          show={this.props.show}
          currentPoint={this.state.currentPoint}
          prePeriod={this.state.prePeriod}
          period={this.state.period}
        />
      </>
    );
  }
}

export default OrbitPlotter;
