import { AnimationStatus } from '../components/tans_theorem/AnimationFinalCard';
import { PreperiodicPoint } from '../components/tans_theorem/tansTheoremUtils';
import { ViewerControlSprings } from './types';

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

export interface TansDialogsProps {
  show: boolean;
  animationState: AnimationStatus;
  setAnimationState: React.Dispatch<React.SetStateAction<AnimationStatus>>;
  handleQuit: () => void;
}

export interface PointsListProps {
  focusedPoint: PreperiodicPoint;
  points: PreperiodicPoint[];
  displayText: (c: PreperiodicPoint) => string;
  handleSelection: (point: PreperiodicPoint) => void;
}

export interface ZoomCardProps extends SelectMenuProps {
  mandelbrotControls: ViewerControlSprings;
  juliaControls: ViewerControlSprings;
  animationState: AnimationStatus;
  setAnimationState: React.Dispatch<React.SetStateAction<AnimationStatus>>;
  focusedPointMandelbrot: PreperiodicPoint;
  focusedPointJulia: PreperiodicPoint;
}

export interface PlayCardProps {
  focusedPointMandelbrot: PreperiodicPoint;
  magnification: number;
}

export interface SimilarityAnimationProps {
  show: boolean;
  animationState: AnimationStatus;
  focusedPointMandelbrot: PreperiodicPoint;
  focusedPointJulia: PreperiodicPoint;
  pointsMandelbrot: PreperiodicPoint[];
  pointsJulia: PreperiodicPoint[];
  handlePointSelectionMandelbrot: (focusedPoint: PreperiodicPoint) => void;
  handlePointSelectionJulia: (focusedPoint: PreperiodicPoint) => void;
}
