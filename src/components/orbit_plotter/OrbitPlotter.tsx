import React, { Component } from 'react';
import { orbitList } from '../../common/complex_number_helper';
import { ViewerControlSprings, XYType } from '../../common/types';
import OrbitCard from './OrbitCard';
import OrbitMarker from './OrbitMarker';

type OrbitManagerState = {
  currentPoint: XYType;
  period: number;
  prePeriod: number;
  orbitPoints: JSX.Element[];
};

type OrbitPlotterProps = {
  show: boolean;
  mandelbrot: ViewerControlSprings;
  rendererWidth: number;
  rendererHeight: number;
};

const withinBoundBox = (
  p: XYType,
  boxCentre: XYType,
  boxWidth: number,
  boxHeight: number,
  angleRelativeToBox: number,
): boolean => {
  const distanceX = p[0] - boxCentre[0];
  const distanceY = p[1] - boxCentre[1];

  const horizontalDistance: number = Math.abs(
    distanceX * Math.cos(angleRelativeToBox) - distanceY * Math.sin(angleRelativeToBox),
  );
  const verticalDistance: number = Math.abs(
    distanceX * Math.sin(angleRelativeToBox) + distanceY * Math.cos(angleRelativeToBox),
  );

  return horizontalDistance < boxWidth && verticalDistance < boxHeight;
};

const COLOUR_PERIODIC = '#EE0000';
const COLOUR_PREPERIODIC = '#EEEE00';

export class OrbitPlotter extends Component<OrbitPlotterProps, OrbitManagerState> {
  tick() {
    const ASPECT_RATIO = this.props.rendererWidth / this.props.rendererHeight;
    const orbitInformation = orbitList(
      this.props.mandelbrot.xyCtrl[0].xy.getValue(),
      this.props.mandelbrot.xyCtrl[0].xy.getValue(),
      20,
    );
    const orbitPs = orbitInformation[0].filter((x) =>
      withinBoundBox(
        x,
        this.props.mandelbrot.xyCtrl[0].xy.getValue(),
        ASPECT_RATIO / this.props.mandelbrot.zoomCtrl[0].z.getValue(),
        1 / this.props.mandelbrot.zoomCtrl[0].z.getValue(),
        -this.props.mandelbrot.rotCtrl[0].theta.getValue(),
      ),
    );
    this.setState({
      currentPoint: this.props.mandelbrot.xyCtrl[0].xy.getValue(),
      prePeriod: orbitInformation[1],
      period: orbitInformation[2],
      orbitPoints: [...Array(orbitPs.length).keys()].map((i) => {
        const p = orbitPs[i];
        const color =
          i + 1 > orbitPs.length - orbitInformation[2]
            ? COLOUR_PERIODIC
            : COLOUR_PREPERIODIC;
        return (
          <OrbitMarker
            key={p.toString()}
            iterate={p}
            mapWidth={this.props.rendererWidth}
            mapHeight={this.props.rendererHeight}
            show={true}
            mandelbrotControl={this.props.mandelbrot}
            color={color}
          />
        );
      }),
    });
  }

  UNSAFE_componentWillMount() {
    this.tick();
  }

  componentDidMount() {
    setInterval(() => this.tick(), 100);
  }

  render() {
    return (
      <>
        {this.props.show ? this.state.orbitPoints : null}
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
