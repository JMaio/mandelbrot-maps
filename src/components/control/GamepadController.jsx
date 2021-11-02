/* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling
// https://codesandbox.io/s/react-gamepad-menu-w-controller-ui-hook-version-shenmue-horse-working-oioei?file=/src/components/GamepadController.jsx
import React, { useState } from 'react';
import { useGamepads } from 'react-gamepads';
// import useGamepads from "../hooks/useGamepads";
import GamepadSvg from './GamepadSvg';

// interface GamepadControllerProps {
//   visible: boolean;
// }

function GamepadController(props) {
  const [gamepads, setGamepads] = useState({});
  useGamepads((gamepads) => setGamepads(gamepads));
  // console.log(gamepads);
  const calcDirectionVertical = (axe) => {
    // Up
    if (axe < -0.2) {
      return 'up';
    }
    // Down
    if (axe > 0.2) {
      return 'down';
    }
  };

  const calcDirectionHorizontal = (axe) => {
    // Left
    if (axe < -0.2) {
      return 'left';
    }
    // Right
    if (axe > 0.2) {
      return 'right';
    }
  };
  // console.log([
  //   calcDirectionHorizontal(gamepads[0].axes[0]),
  //   calcDirectionVertical(gamepads[0].axes[1])
  // ]);
  return (
    <div
      className="gamepads"
      style={{
        display: props.visible ? 'block' : 'none',
        transform: 'translate(-72px, 0%) scale(0.5)',
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
            directionUp={gamepads[0].buttons[12].pressed}
            directionDown={gamepads[0].buttons[13].pressed}
            directionLeft={gamepads[0].buttons[14].pressed}
            directionRight={gamepads[0].buttons[15].pressed}
            buttonDown={gamepads[0].buttons[0].pressed}
            buttonRight={gamepads[0].buttons[1].pressed}
            buttonLeft={gamepads[0].buttons[2].pressed}
            buttonUp={gamepads[0].buttons[3].pressed}
            select={gamepads[0].buttons[8].pressed}
            start={gamepads[0].buttons[9].pressed}
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
