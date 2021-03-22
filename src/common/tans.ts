import { AnimationStatus } from '../components/tans_theorem/AnimationFinalCard';
import { PreperiodicPoint } from '../components/tans_theorem/tansTheoremUtils';
import { ViewerControlSprings } from './types';

export interface AnimationFinalCardProps {
  animationState: AnimationStatus;
  handleReset: () => void;
}

export interface ManagerProps {
  show: boolean;
  magnification: number;
  aspectRatio: number;
  viewerControls: ViewerControlSprings;
  focusedPoint: PreperiodicPoint;
  setter: (focusedPoint: PreperiodicPoint) => void;
}

export interface MandelbrotManagerProps extends ManagerProps {
  shadeMisiurewiczDomains: boolean;
}

export interface JuliaManagerProps extends ManagerProps {
  similarPointsJulia: PreperiodicPoint[];
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

export interface MisiurewiczPointsListProps {
  show: boolean;
  mandelbrot: ViewerControlSprings;
  focusedPoint: PreperiodicPoint;
  handleMandelbrotSelection: (focusedPointMandelbrot: PreperiodicPoint) => void;
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

export interface SimilarPointsListProps {
  focusedPointMandelbrot: PreperiodicPoint;
  focusedPointJulia: PreperiodicPoint;
  similarPointsJulia: PreperiodicPoint[];
  handleSimilarPointSelection: (focusedPointJulia: PreperiodicPoint) => void;
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
