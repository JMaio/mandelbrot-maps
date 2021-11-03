/* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling
// https://codesandbox.io/s/react-gamepad-menu-w-controller-ui-hook-version-shenmue-horse-working-oioei?file=/src/components/GamepadController.jsx
import React, { useEffect, useState } from 'react';
import { useGamepads } from 'react-gamepads';
import { ViewerControlSprings } from '../../common/types';
// import useGamepads from "../hooks/useGamepads";
import GamepadSvg from './GamepadSvg';

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

  const [{ theta }, setControlRot] = spring.rotCtrl;

  useEffect(() => {
    // If controller connected with buttons
    if (gamepads && gamepads[0] && gamepads[0].buttons.length > 0) {
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
  }, [gamepads, theta, setControlRot, maxVelocity, velocity]);

  const calcDirectionVertical = (axe: number): string => {
    // Up
    if (axe < -0.2) {
      return 'up';
    }
    // Down
    if (axe > 0.2) {
      return 'down';
    }
    return 'none';
  };

  const calcDirectionHorizontal = (axe: number): string => {
    // Left
    if (axe < -0.2) {
      return 'left';
    }
    // Right
    if (axe > 0.2) {
      return 'right';
    }
    return 'none';
  };

  // console.log([
  //   calcDirectionHorizontal(gamepads[0].axes[0]),
  //   calcDirectionVertical(gamepads[0].axes[1])
  // ]);
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
            analogLeft={
              gamepads[0].axes[0] > 0.3 ||
              gamepads[0].axes[0] < -0.3 ||
              gamepads[0].axes[1] > 0.3 ||
              gamepads[0].axes[1] < -0.3
            }
            analogRight={
              gamepads[0].axes[2] > 0.3 ||
              gamepads[0].axes[2] < -0.3 ||
              gamepads[0].axes[3] > 0.3 ||
              gamepads[0].axes[3] < -0.3
            }
            // strings: directions ("up" / "down" / ...)
            analogLeftDirection={[
              calcDirectionHorizontal(gamepads[0].axes[0]),
              calcDirectionVertical(gamepads[0].axes[1]),
            ]}
            analogRightDirection={[
              calcDirectionHorizontal(gamepads[0].axes[2]),
              calcDirectionVertical(gamepads[0].axes[3]),
            ]}
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
