import { AnimationStatus } from '../components/tans_theorem/AnimationFinalCard';
import { PreperiodicPoint } from '../components/tans_theorem/tansTheoremUtils';
import { ViewerControlSprings } from './types';

export interface NearestMisiurewiczCardProps {
  onClick: () => void;
}

export interface MarkerManagerProps {
  show: boolean;
  aspectRatio: number;
  viewerControls: ViewerControlSprings;
  focusedPoint: PreperiodicPoint;
  setter: (focusedPoint: PreperiodicPoint) => void;
  points: PreperiodicPoint[];
}

export interface ComplexNumberMarkerProps {
  aspectRatio: number;
  m: PreperiodicPoint;
  viewerControl: ViewerControlSprings;
  onClick: () => void;
  isFocused: boolean;
}

export interface SelectMenuProps {
  show: boolean;
  handleQuit: () => void;
  handleGo: () => void;
}

export interface PointsListProps {
  focusedPoint: PreperiodicPoint;
  points: PreperiodicPoint[];
  displayText: (c: PreperiodicPoint) => string;
  handleSelection: (point: PreperiodicPoint) => void;
}

export interface AnimationFinalCardProps extends SelectMenuProps {
  focusedPointMandelbrot: PreperiodicPoint;
  magnification: number;
  rotateWhileZooming: boolean;
}
export interface SelfSimilaritySliderProps {
  focusedPointMandelbrot: PreperiodicPoint;
  magnification: number;
}

export interface TansTheoremProgressCardProps {
  animationState: AnimationStatus;
  focusedPointMandelbrot: PreperiodicPoint;
  focusedPointJulia: PreperiodicPoint;
  mandelbrotControls: ViewerControlSprings;
  juliaControls: ViewerControlSprings;
  setAnimationState: React.Dispatch<React.SetStateAction<AnimationStatus>>;
  handleQuit: () => void;
  pointsMandelbrot: PreperiodicPoint[];
  pointsJulia: PreperiodicPoint[];
  handlePointSelectionMandelbrot: (focusedPoint: PreperiodicPoint) => void;
  handlePointSelectionJulia: (focusedPoint: PreperiodicPoint) => void;
}

export interface ZoomCardProps {
  animationState: AnimationStatus;
  focusedPointMandelbrot: PreperiodicPoint;
  focusedPointJulia: PreperiodicPoint;
  mandelbrotControls: ViewerControlSprings;
  juliaControls: ViewerControlSprings;
  setAnimationState: React.Dispatch<React.SetStateAction<AnimationStatus>>;
  handleQuit: () => void;
}

export interface SimilarityAnimationProps {
  animationState: AnimationStatus;
  focusedPointMandelbrot: PreperiodicPoint;
  focusedPointJulia: PreperiodicPoint;
  pointsMandelbrot: PreperiodicPoint[];
  pointsJulia: PreperiodicPoint[];
  handlePointSelectionMandelbrot: (focusedPoint: PreperiodicPoint) => void;
  handlePointSelectionJulia: (focusedPoint: PreperiodicPoint) => void;
}
