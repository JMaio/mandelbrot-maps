/* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling
// https://codesandbox.io/s/react-gamepad-menu-w-controller-ui-hook-version-shenmue-horse-working-oioei?file=/src/components/GamepadController.jsx
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useGamepads } from 'react-gamepads';
import { addV } from 'react-use-gesture';
import { vRotate, vScale } from 'vec-la-fp';
import { ViewerControlSprings, XYType } from '../../common/types';
// import useGamepads from "../hooks/useGamepads";
import GamepadSvg from './GamepadSvg';
import { analogStickOverDeadzone, analogTriggerOverDeadzone } from './utils';

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

  const [analog, setAnalog] = useState<readonly number[]>([]);
  const [triggerLeft, setTriggerLeft] = useState<number>(0);
  const [triggerRight, setTriggerRight] = useState<number>(0);

  // const analog = gamepads[0].axes;
  const analogLeft: AnalogStick = {
    x: analog[0],
    y: analog[1],
  };
  const analogRight: AnalogStick = {
    x: analog[2],
    y: analog[3],
  };

  const deltaTheta = 0.1;
  const acceleration = 0.075;
  const [velocity, setVelocity] = useState<number>(1);
  const resetVelocity = () => setVelocity(1);
  const maxVelocity = 1 / deltaTheta;

  const svgScale = 0.5;

  useGamepads((gs) => {
    // console.log(gamepads);
    setGamepads(gs);
    setAnalog(gs[0].axes);
    setTriggerLeft(gs[0].buttons[6].value);
    setTriggerRight(gs[0].buttons[7].value);
  });

  const [{ xy }, setControlXY] = spring.xyCtrl;
  const [{ z, minZoom, maxZoom }, setControlZoom] = spring.zoomCtrl;
  const [{ theta }, setControlRot] = spring.rotCtrl;

  // If controller connected with buttons
  const controllerConnected = useCallback(
    () => gamepads && gamepads[0] && gamepads[0].buttons.length > 0,
    [gamepads],
  );

  // rotation
  useEffect(() => {
    if (controllerConnected()) {
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
        // const mult = lb * -1 + rb * 1;
        const mult = -lb + rb;
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
  }, [controllerConnected, gamepads, setControlRot, theta, velocity, maxVelocity]);

  // panning
  useEffect(() => {
    if (controllerConnected()) {
      const s: AnalogStick = analogLeft;

      if (analogStickOverDeadzone(s)) {
        const axes: XYType = [
          // multiply by abs value to "square" while keeping sign,
          // exponentiate to make it more sensitive
          s.x * Math.abs(s.x) ** 1.5,
          s.y * Math.abs(s.y) ** 1.5 * -1,
        ];
        // scale by the "real" zoom to make moving more precise at higher magnification,
        // rotate by theta to correctly interpret the controller movement
        const newXY = addV(xy.get(), vScale(3e-1 / z.get(), vRotate(theta.get(), axes)));
        setControlXY({
          xy: newXY,
        });
      }
    }
  });

  // zoom
  useEffect(() => {
    if (controllerConnected()) {
      // left trigger zooms out, right trigger zooms in
      const tl: AnalogTrigger = triggerLeft;
      const tr: AnalogTrigger = triggerRight;

      if (analogTriggerOverDeadzone(tl) || analogTriggerOverDeadzone(tr)) {
        // resultant zoom level is the sum of the two trigger values
        const diff = tr - tl;
        // get the signed cube of the difference
        const newZ = z.get() * (1 + Math.abs(diff) * diff);
        const newZclamp = _.clamp(newZ, minZoom.get(), maxZoom.get());
        setControlZoom({
          z: newZclamp,
        });
      }
    }
  });

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
            // triggers
            triggerLeft={triggerLeft}
            triggerRight={triggerRight}
            // middle buttons
            select={gamepads[0].buttons[8].pressed}
            start={gamepads[0].buttons[9].pressed}
            // booleans
            // analog={}
            analogLeft={analogLeft}
            analogRight={analogRight}
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
