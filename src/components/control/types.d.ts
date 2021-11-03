interface GamepadButtonsProps {
  buttonLeft: boolean;
  buttonUp: boolean;
  buttonDown: boolean;
  buttonRight: boolean;
  //
  bumperLeft: boolean;
  bumperRight: boolean;
  //
  directionUp: boolean;
  directionDown: boolean;
  directionLeft: boolean;
  directionRight: boolean;
  //
  select: boolean;
  start: boolean;
  // [key: string]: boolean;
}
interface GamepadAnalogProps {
  analog: number[];
  // analogLeft: boolean;
  // analogRight: boolean;
  // analogLeftDirection: string[];
  // analogRightDirection: string[];
  // [key: string]: string[];
}

type AnalogStick = { x: number; y: number };

interface GamepadStyleProps {
  activeColor?: string;
  inactiveColor?: string;
  scale?: number;
}

type GamepadSvgProps = GamepadButtonsProps & GamepadAnalogProps & GamepadStyleProps;
