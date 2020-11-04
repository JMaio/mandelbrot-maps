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
import { ViewerControlSprings, ViewerLocation } from './types';
import { screenScaleMultiplier, springsConfigs } from './values';

// https://usehooks.com/useWindowSize/
export function useWindowSize(): { width?: number; height?: number } {
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
      return () => {
        // do nothing
      };
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
  controls: ViewerControlSprings;
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
  controls,
  screenScaleMultiplier,
  setDragging,
}: GenericTouchBindParams): GenericTouchBindReturn {
  const [{ xy }, setControlXY] = controls.xyCtrl;
  const [{ z, minZoom, maxZoom }, setControlZoom] = controls.zoomCtrl;
  const [{ theta }, setControlRot] = controls.rotCtrl;
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
        const newZ = zoom * (1 + dx * 3e-2);
        const newZclamp = _.clamp(newZ, minZoom.getValue(), maxZoom.getValue());

        // let realZoom = gl.current.canvas.height * newZclamp * screenScaleMultiplier;
        // let plotMovement = scale(subV(origin, initialOrigin), -2/realZoom);
        // let relMove = [plotMovement[0], -plotMovement[1]];

        setControlZoom({
          z: newZclamp,
          config: down ? springsConfigs.user.zoom : springsConfigs.default.zoom,
          // immediate: true,
          // config: {
          //   // value needs revising, currently too slow
          //   velocity: 10 * vd,
          // },
        });

        // setControlPos({
        //   pos: addV(p, relMove),                    // add the displacement to the starting position
        //   immediate: down,                                  // immediately apply if the gesture is active
        // });

        return memo;
      },

      onWheel: ({
        movement: [, my],
        active,
        shiftKey,
        memo = { zoom: z.getValue(), t: theta.getValue() },
      }: FullGestureState<StateKey<'wheel'>>) => {
        if (shiftKey) {
          // const t = theta.getValue();

          const newT = memo.t + my * 0.0015;

          setControlRot({
            theta: newT,
            config: active ? springsConfigs.user.rot : springsConfigs.default.rot,
            // immediate: active,
            // config: {
            //   // velocity: active ? 0 : 50,
            // },
          });
        } else {
          // const zoom = z.getValue();
          // set different multipliers based on zoom direction
          //                              zoom     in      out
          const newZ = memo.zoom * (1 - my * (my < 0 ? 3e-3 : 1e-3));

          setControlZoom({
            z: _.clamp(newZ, minZoom.getValue(), maxZoom.getValue()),
            config: active ? springsConfigs.user.zoom : springsConfigs.default.zoom,
            // immediate: active,
            // config: {
            //   // velocity: active ? 0 : 50,
            // },
          });
        }
        return memo;
      },

      onDrag: ({
        down,
        movement,
        direction: [dx, dy],
        velocity,
        pinching,
        last,
        cancel,
        memo = { xy: xy.getValue(), theta: theta.getValue() },
      }: FullGestureState<StateKey<'drag'>>) => {
        // let pinch handle movement
        if (pinching) cancel && cancel();
        // change according to this formula:
        // move (x, y) in the opposite direction of drag (pan with cursor)
        // divide by canvas size to scale appropriately
        // multiply by 2 to correct scaling on viewport (?)
        // use screen multiplier for more granularity
        const realZoom =
          (domTarget.current?.height || 100) * z.getValue() * screenScaleMultiplier;

        const [px, py]: Vector = vScale(-2 / realZoom, movement);
        // const relMove: Vector = vScale(2 / realZoom, movement);

        const relMove: Vector = [px, -py];
        // const relDir: Vector = [dx, -dy];

        const t = theta.getValue();

        setControlXY({
          // add to the current position the relative displacement (relMove), rotated by theta,
          // to maintain the correct displacement direction (without this it would move as if theta=0)
          xy: addV(memo.xy, vRotate(t, relMove)), // add the displacement to the starting position
          // immediate: down, // immediately apply if the gesture is active
          config: down ? springsConfigs.user.xy : springsConfigs.default.xy,
          //  {
          //   // velocity also needs to be rotated according to theta
          //   // -@ts-expect-error - velocity should be `[number, number]`, but only `number` allowed
          //   // velocity: vScale(-velocity / realZoom, vRotate(t, relDir)), // set the velocity (gesture momentum)
          //   // velocity: vMag(vScale(-velocity / realZoom, vRotate(t, relDir))), // set the velocity (gesture momentum)
          //   // velocity: velocity / screenScaleMultiplier, // set the velocity (gesture momentum)
          //   // mass: down ? 1 : 5,
          //   ...xyCtrlSpringConfig,
          //   tension: down ? xyCtrlSpringConfig.tension : xyCtrlSpringConfig.tension / 2,
          //   // -@ts-expect-error - decay is undocumented?
          //   // decay: true,
          // },
        });

        // tell the renderer that it's being dragged on
        setDragging(down);

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

/**
 * Warps the given controller to a desired viewer location.
 * @param controls The controller to be animated
 * @param location The (partial) viewer location to warp to: xy, zoom, theta
 * @param immediate Should the update happen immediately? (Useful for testing)
 */
export function warpToPoint(
  controls: ViewerControlSprings,
  { xy, z, theta }: Partial<ViewerLocation>,
  immediate = false,
): void {
  // can't do a simple "if (x)" check since values could be zero (evaluates to "false")
  if (xy !== undefined) {
    controls.xyCtrl[1]({
      // use screen scale multiplier for a simpler API
      xy: vScale(1 / screenScaleMultiplier, xy),
      config: springsConfigs.default.xy,
      immediate: immediate,
    });
  }
  if (z !== undefined) {
    controls.zoomCtrl[1]({
      z: z,
      config: springsConfigs.default.zoom,
      immediate: immediate,
    });
  }
  if (theta !== undefined) {
    controls.rotCtrl[1]({
      theta: theta,
      config: springsConfigs.default.rot,
      immediate: immediate,
    });
  }
}
