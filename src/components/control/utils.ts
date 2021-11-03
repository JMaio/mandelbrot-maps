// threshold to mark analog stick as "active"
export const analogDeadzone = 0.35;

export const analogAbs = ({ x, y }: AnalogStick): number => Math.sqrt(x * x + y * y);

export const analogOverDeadzone = (s: AnalogStick): boolean =>
  analogAbs(s) > analogDeadzone;

// /**
//  * Scales the analog range (0.0 -> 1.0) to unit range (-1.0 -> 1.0)
//  * x starts in range 0.0 -> 1.0
//  * subtract 0.5 to go to range -0.5 -> 0.5
//  * multiply by 2 to go to range -1.0 -> 1.0
//  * @param s
//  * @returns
//  */
// export const scaleAnalogToUnitRange = (s: AnalogStick): [number, number] => [
//   (s.x - 0.5) * 2,
//   (s.y - 0.5) * 2,
// ];
