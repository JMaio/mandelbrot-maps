/* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling
// https://codesandbox.io/s/react-gamepad-menu-w-controller-ui-hook-version-shenmue-horse-working-oioei?file=/src/components/GamepadController.jsx
import React, { useCallback, useEffect, useState } from 'react';
import { useGamepads } from 'react-gamepads';
import { addV } from 'react-use-gesture';
import { vRotate, vScale } from 'vec-la-fp';
import { ViewerControlSprings, XYType } from '../../common/types';
// import useGamepads from "../hooks/useGamepads";
import GamepadSvg from './GamepadSvg';
import { analogOverDeadzone } from './utils';

interface GamepadControllerProps extends React.HTMLAttributes<HTMLDivElement> {
  visible: boolean;
  spring: ViewerControlSprings;
}

/**
 * Use https://luser.github.io/gamepadtest/ to check gamepad
 *
 */
function GamepadController({
  visible,
  spring,
  ...props
}: GamepadControllerProps): JSX.Element {
  // gamepad isn't properly typed, so `any` will have to do
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [gamepads, setGamepads] = useState<any>({});

  const deltaTheta = 0.1;
  const acceleration = 0.075;
  const [velocity, setVelocity] = useState<number>(1);
  const resetVelocity = () => setVelocity(1);
  const maxVelocity = 1 / deltaTheta;

  const svgScale = 0.5;

  useGamepads((gamepads) => {
    // console.log(gamepads);
    setGamepads(gamepads);
  });

  const [{ xy }, setControlXY] = spring.xyCtrl;
  const [{ z }] = spring.zoomCtrl;
  const [{ theta }, setControlRot] = spring.rotCtrl;

  // If controller connected with buttons
  const controllerConnected = useCallback(
    () => gamepads && gamepads[0] && gamepads[0].buttons.length > 0,
    [gamepads],
  );

  useEffect(() => {
    if (controllerConnected()) {
      // try {
      const lb = gamepads[0].buttons[4].pressed;
      const rb = gamepads[0].buttons[5].pressed;
      // buttons are being pressed
      if (lb || rb) {
        // if lb   pressed, -1
        // if rb   pressed, +1
        // if both pressed, 0
        if (lb && rb) {
          resetVelocity();
          return;
        }
        const mult = lb * -1 + rb * 1;
        setControlRot({
          theta: theta.get() + deltaTheta * mult * velocity,
        });

        // increase velocity while pressed
        setVelocity((v) => Math.min(v + acceleration, maxVelocity));
      } else {
        resetVelocity();
      }
      // } catch (error) {
      //   console.log(error);
      // }
    }
  }, [gamepads, theta, setControlRot, maxVelocity, velocity, controllerConnected]);

  useEffect(() => {
    if (controllerConnected()) {
      const analog: AnalogStick = {
        x: gamepads[0].axes[0],
        y: gamepads[0].axes[1],
      };
      if (analogOverDeadzone(analog)) {
        const axes: XYType = [
          // multiply by abs value to "square" while keeping sign,
          // exponentiate to make it more sensitive
          analog.x * Math.abs(analog.x) ** 1.5,
          analog.y * Math.abs(analog.y) ** 1.5 * -1,
        ];
        // scale by the "real" zoom to make moving more precise at higher magnification,
        // rotate by theta to correctly interpret the controller movement
        const newXY = addV(xy.get(), vScale(3e-1 / z.get(), vRotate(theta.get(), axes)));
        setControlXY({
          xy: newXY,
        });
      }
    }
  }, [gamepads, xy, z, theta, setControlXY, controllerConnected]);

  return (
    <div
      className="gamepads"
      style={{
        display: visible ? 'block' : 'none',
        transform: 'translate(-72px, 0%)',
        marginTop: 8,
      }}
      // style={{
      //   position: 'fixed',
      //   bottom: 0,
      //   right: 0,
      // }}
    >
      {/* <small>Gamepads</small> */}
      {/* {gamepadDisplay} */}
      {gamepads && gamepads[0] && (
        <>
          <GamepadSvg
            scale={svgScale}
            // d-pad
            directionUp={gamepads[0].buttons[12].pressed}
            directionDown={gamepads[0].buttons[13].pressed}
            directionLeft={gamepads[0].buttons[14].pressed}
            directionRight={gamepads[0].buttons[15].pressed}
            // abxy
            buttonDown={gamepads[0].buttons[0].pressed}
            buttonRight={gamepads[0].buttons[1].pressed}
            buttonLeft={gamepads[0].buttons[2].pressed}
            buttonUp={gamepads[0].buttons[3].pressed}
            // bumpers
            bumperLeft={gamepads[0].buttons[4].pressed}
            bumperRight={gamepads[0].buttons[5].pressed}
            //
            select={gamepads[0].buttons[8].pressed}
            start={gamepads[0].buttons[9].pressed}
            // booleans
            analog={gamepads[0].axes}
          />
          {/* <h3>Player 1</h3> */}
        </>
      )}
    </div>
  );
}

// GamepadController.propTypes = {
//   visible: PropTypes.bool,
// };

export default GamepadController;
