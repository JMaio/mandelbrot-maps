import { AnimationStatus } from '../components/tans_theorem/AnimationFinalCard';
import { PreperiodicPoint } from '../components/tans_theorem/tansTheoremUtils';
import { ViewerControlSprings } from './types';

export interface AnimationFinalCardProps {
  animationState: AnimationStatus;
  handleReset: () => void;
}

export interface MarkerManagerProps {
  show: boolean;
  aspectRatio: number;
  viewerControls: ViewerControlSprings;
  focusedPoint: PreperiodicPoint;
  setter: (focusedPoint: PreperiodicPoint) => void;
  points: PreperiodicPoint[];
}

export interface InfoCardProps {
  show: boolean;
  mandelbrot: ViewerControlSprings;
  julia: ViewerControlSprings;
  animationState: AnimationStatus;
  setAnimationState: React.Dispatch<React.SetStateAction<AnimationStatus>>;
  focusedPointMandelbrot: PreperiodicPoint;
  focusedPointJulia: PreperiodicPoint;
  handleMandelbrotSelection: (focusedPointMandelbrot: PreperiodicPoint) => void;
  quitButton: () => JSX.Element;
}

export interface PointsListProps {
  focusedPoint: PreperiodicPoint;
  points: PreperiodicPoint[];
  displayText: (c: PreperiodicPoint) => string;
  handleSelection: (point: PreperiodicPoint) => void;
}

export interface MisiurewiczDomainsMenuProps {
  show: boolean;
  mandelbrot: ViewerControlSprings;
  julia: ViewerControlSprings;
  setAnimationState: React.Dispatch<React.SetStateAction<AnimationStatus>>;
  focusedPointMandelbrot: PreperiodicPoint;
  focusedPointJulia: PreperiodicPoint;
  quitButton: () => JSX.Element;
}

export interface ZoomCardProps {
  show: boolean;
  mandelbrot: ViewerControlSprings;
  julia: ViewerControlSprings;
  animationState: AnimationStatus;
  setAnimationState: React.Dispatch<React.SetStateAction<AnimationStatus>>;
  focusedPointMandelbrot: PreperiodicPoint;
  focusedPointJulia: PreperiodicPoint;
  backButton: () => JSX.Element;
}

export interface PlayCardProps {
  focusedPointMandelbrot: PreperiodicPoint;
  magnification: number;
}

export interface ComplexNumberMarkerProps {
  aspectRatio: number;
  m: PreperiodicPoint;
  viewerControl: ViewerControlSprings;
  onClick: () => void;
  isFocused: boolean;
}

export interface SimilarityAnimationProps {
  show: boolean;
  animationState: AnimationStatus;
  focusedPoint: PreperiodicPoint;
  focusedPointJulia: PreperiodicPoint;
}

export interface SimilarityMenuProps {
  show: boolean;
  julia: ViewerControlSprings;
  setAnimationState: React.Dispatch<React.SetStateAction<AnimationStatus>>;
  focusedPointMandelbrot: PreperiodicPoint;
  focusedPointJulia: PreperiodicPoint;
  handleSimilarPointSelection: (focusedPointJulia: PreperiodicPoint) => void;
  similarPointsJulia: PreperiodicPoint[];
  backButton: () => JSX.Element;
}

export interface IntroCardProps {
  show: boolean;
  mandelbrot: ViewerControlSprings;
  julia: ViewerControlSprings;
  animationState: AnimationStatus;
  setAnimationState: React.Dispatch<React.SetStateAction<AnimationStatus>>;
  focusedPointMandelbrot: PreperiodicPoint;
  focusedPointJulia: PreperiodicPoint;
  handleMandelbrotSelection: (focusedPointMandelbrot: PreperiodicPoint) => void;
  quitButton: () => JSX.Element;
}
