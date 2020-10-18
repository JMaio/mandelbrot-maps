import _ from 'lodash';
import { RefObject, useCallback, useEffect, useState } from 'react';
import { addV } from 'react-use-gesture';
import {
  FullGestureState,
  StateKey,
  UseGestureConfig,
  UserHandlersPartial,
} from 'react-use-gesture/dist/types';
import { Vector, vRotate, vScale } from 'vec-la-fp';
import {
  ViewerRotationControlSpring,
  ViewerXYControlSpring,
  ViewerZoomControlSpring,
} from '../common/types';

// https://usehooks.com/useWindowSize/
export function useWindowSize() {
  const isClient = typeof window === 'object';

  const getSize = useCallback(
    () => ({
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
    }),
    [isClient],
  );

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) {
      // return false;
      return () => {};
    }

    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getSize, isClient]); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
}

export interface GenericTouchBindParams {
  domTarget: RefObject<HTMLCanvasElement>;
  xyCtrl: ViewerXYControlSpring;
  zoomCtrl: ViewerZoomControlSpring;
  rotCtrl: ViewerRotationControlSpring;
  screenScaleMultiplier: number;
  // gl: any,
  setDragging: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface GenericTouchBindReturn {
  handlers: UserHandlersPartial;
  config: UseGestureConfig;
}

// a touchbind for re-using across renderers
export function genericTouchBind({
  domTarget,
  xyCtrl,
  zoomCtrl,
  rotCtrl,
  screenScaleMultiplier,
  // gl,
  setDragging,
}: GenericTouchBindParams): GenericTouchBindReturn {
  const [{ xy }, setControlXY] = xyCtrl;
  const [{ z, minZoom, maxZoom }, setControlZoom] = zoomCtrl;
  const [{ theta }] = rotCtrl || [{ theta: { getValue: () => 0 } }, () => {}];
  return {
    handlers: {
      // prevent some browser events such as swipe-based navigation or
      // pinch-based zoom and instead redirect them to this handler
      onDragStart: ({ event }: FullGestureState<StateKey<'drag'>>) =>
        event?.preventDefault(),
      onPinchStart: ({ event }: FullGestureState<StateKey<'pinch'>>) =>
        event?.preventDefault(),

      onPinch: ({
        vdva: [vd],
        down,
        delta: [dx],
        origin,
        first,
        memo = [xy.getValue()],
      }: FullGestureState<StateKey<'pinch'>>) => {
        if (first) {
          const [p] = memo;
          return [p, origin];
        }
        const zoom = z.getValue();
        // initial origin access
        // let [p, initialOrigin] = memo;
        const newZ = zoom * (1 + dx * 5e-3);
        const newZclamp = _.clamp(newZ, minZoom.getValue(), maxZoom.getValue());

        // let realZoom = gl.current.canvas.height * newZclamp * screenScaleMultiplier;
        // let plotMovement = scale(subV(origin, initialOrigin), -2/realZoom);
        // let relMove = [plotMovement[0], -plotMovement[1]];

        setControlZoom({
          z: newZclamp,
          immediate: down,
          config: {
            // value needs revising, currently too slow
            velocity: 10 * vd,
          },
        });

        // setControlPos({
        //   pos: addV(p, relMove),                    // add the displacement to the starting position
        //   immediate: down,                                  // immediately apply if the gesture is active
        // });

        return memo;
      },

      onWheel: ({ movement: [, my], active }: FullGestureState<StateKey<'wheel'>>) => {
        const zoom = z.getValue();
        // set different multipliers based on zoom direction
        //                              zoom     in    out
        const newZ = zoom * (1 - my * (my < 0 ? 1e-3 : 6e-4));

        setControlZoom({
          z: _.clamp(newZ, minZoom.getValue(), maxZoom.getValue()),
          // immediate: active,
          // config: {
          //   // velocity: active ? 0 : 50,
          // },
        });

        return zoom;
      },

      onDrag: ({
        down,
        movement,
        velocity,
        direction,
        pinching,
        memo = { xy: xy.getValue(), theta: theta.getValue() },
      }: FullGestureState<StateKey<'drag'>>) => {
        // let pinch handle movement
        if (pinching) return;
        // change according to this formula:
        // move (x, y) in the opposite direction of drag (pan with cursor)
        // divide by canvas size to scale appropriately
        // multiply by 2 to correct scaling on viewport (?)
        // use screen multiplier for more granularity
        const realZoom =
          (domTarget.current?.height || 1) * z.getValue() * screenScaleMultiplier;

        const plotMovement: Vector = vScale(-2 / realZoom, movement);

        const relMove: Vector = [plotMovement[0], -plotMovement[1]];
        const relDir: Vector = [direction[0], -direction[1]];

        // console.log(memo.xy);
        // console.log(relMove);
        const t = theta.getValue();

        setControlXY({
          // add to the current position the relative displacement (relMove), rotated by theta,
          // to maintain the correct displacement direction (without this it would move as if theta=0)
          xy: addV(memo.xy, vRotate(t, relMove)), // add the displacement to the starting position
          immediate: down, // immediately apply if the gesture is active
          config: {
            // velocity also needs to be rotated according to theta
            velocity: vScale(-velocity / realZoom, vRotate(t, relDir)), // set the velocity (gesture momentum)
            decay: true,
          },
        });

        // tell the renderer that it's being dragged on
        setDragging(down);
        // try {
        // } catch (e) {}

        return memo;
      },
    },
    config: {
      eventOptions: { passive: false, capture: false },
      domTarget: domTarget,
      // The config object passed to useGesture has drag, wheel, scroll, pinch and move keys
      // for specific gesture options. See here for more details.
      // drag: {
      //   bounds,
      //   rubberband: true,
      // }
    },
  };
}
