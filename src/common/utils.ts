import { easeExpOut } from 'd3-ease';
import _ from 'lodash';
import { RefObject, useCallback, useEffect, useState } from 'react';
import { RgbColor } from 'react-colorful';
import { addV, subV } from 'react-use-gesture';
import {
  FullGestureState,
  Handlers,
  StateKey,
  UseGestureConfig,
  Vector2,
} from 'react-use-gesture/dist/types';
import { Vector, vFastDist, vRotate, vScale } from 'vec-la-fp';
import {
  DefaultViewerParams,
  RgbFloatColour,
  ViewerControlSprings,
  ViewerLocation,
} from './types';
import { MandelbrotMapsEasing, MaterialStandardEasing, springsConfigs } from './values';

// https://usehooks.com/useWindowSize/
export function useWindowSize(): { w: number; h: number } {
  const isClient = typeof window === 'object';

  const getSize = useCallback(
    () => ({
      // default to zero, at least it's not undefined
      w: isClient ? window.innerWidth : 0,
      h: isClient ? window.innerHeight : 0,
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
  }, [getSize, isClient]);
  // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
}

export interface GenericTouchBindParams {
  domTarget: RefObject<HTMLCanvasElement>;
  controls: ViewerControlSprings;
  // screenScaleMultiplier: number;
  // gl: any,
  setDragging: React.Dispatch<React.SetStateAction<boolean>>;
  DPR: number;
  defaultViewerParams: DefaultViewerParams;
}

export interface GenericTouchBindReturn {
  handlers: Handlers;
  config: UseGestureConfig;
}

// --------------------------------------------------------------------------
// https://gist.github.com/evdokimovm/0e7163faf7c8fe24e41e6b68461e4feb
// Convert from degrees to radians.
const degToRad = (deg: number): number => (deg * Math.PI) / 180;
// Math.radians(90); // 1.5707963267948966

// Convert from radians to degrees.
// eslint-disable-next-line
const radToDeg = (rad: number): number => (rad * 180) / Math.PI;
// Math.degrees(3.141592653589793); // 180
// --------------------------------------------------------------------------

// a touchbind for re-using across renderers
export function genericTouchBind({
  domTarget,
  controls,
  setDragging,
  DPR,
  defaultViewerParams: bounds,
}: GenericTouchBindParams): GenericTouchBindReturn {
  const [{ xy }, setControlXY] = controls.xyCtrl;
  const [{ z }, setControlZoom] = controls.zoomCtrl;
  const [{ theta }, setControlRot] = controls.rotCtrl;

  const zoomMult = { in: 3e-3, out: 1e-3 };

  // used to have screenScaleMultiplier here
  const getRealZoom = (z: number) => (domTarget.current?.height || 100) * z;
  // * screenScaleMultiplier;

  /** Re-usable logic for XY "panning" */
  const updateXY = ({
    xy,
    theta,
    relMove,
    down,
  }: {
    xy: Vector2;
    theta: number;
    relMove: Vector2;
    down: boolean;
  }) =>
    setControlXY({
      // add to the current position the relative displacement (relMove), rotated by theta,
      // to maintain the correct displacement direction (without this it would move as if theta=0)
      xy: addV(xy, vScale(DPR, vRotate(theta, relMove))),
      config: down ? springsConfigs.user.xy : springsConfigs.default.xy,
      // reset immediate value from warp function
      immediate: false,
    });

  /** Re-usable logic for zooming */
  const updateZ = ({ z, down }: { z: number; down: boolean }) =>
    setControlZoom({
      z: z,
      config: down ? springsConfigs.user.zoom : springsConfigs.default.zoom,
      // reset immediate value from warp function
      immediate: false,
    });

  /** Re-usable logic for rotating */
  const updateT = ({ t, down }: { t: number; down: boolean }) =>
    setControlRot({
      theta: t,
      // reset immediate value from warp function
      immediate: false,
      config: down ? springsConfigs.user.rot : springsConfigs.default.rot,
    });

  return {
    handlers: {
      // prevent some browser events such as swipe-based navigation or
      // pinch-based zoom and instead redirect them to this handler
      // onDragStart: ({ event }: FullGestureState<StateKey<'drag'>>) =>
      //   event?.preventDefault(),
      // onPinchStart: ({ event }: FullGestureState<StateKey<'pinch'>>) =>
      //   event?.preventDefault(),
      // onWheelStart: ({ event }: FullGestureState<StateKey<'wheel'>>) =>
      //   event?.preventDefault(),

      onPinch: ({
        event,
        da: [d, a],
        vdva: [vd, va],
        down,
        movement: [md, ma],
        delta: [dd, da],
        first,
        // initial, // initial [d, a]
        origin,
        memo = {
          xy: xy.getValue(),
          z: z.getValue(),
          t: theta.getValue(),
          a: 0,
          o: [0, 0] as Vector2,
        },
      }: FullGestureState<StateKey<'pinch'>>) => {
        // disable native browser events
        event && event.preventDefault();

        if (first) {
          // remember the angle, location at which the pinch gesture starts
          // memo.a = a;
          memo.o = origin;
        }

        // new zoom is the product of initial zoom and a function of the delta since the pinch
        //   (initial zoom) exponentially changed by md, with linear and exponential multipliers
        //     linear multiplier:
        //     exponential multiplier: scale faster as pinch becomes more distant
        //     if decreasing, scale must decrease more slowly
        // const em = 1.33;
        // const newZ =
        //   memo.z * (1 + Math.sign(md) * 1e-2 * Math.abs(md) ** (md <= 0 ? 1 / em : em)); //(1 - zdelta * Math.abs(zdelta));
        const newZ = _.clamp(memo.z + md * 1e-2, 0.5, 100_000) ** (1 + md * 1e-3); //(1 - zdelta * Math.abs(zdelta));
        // console.log(Math.abs(md * 1e-2));
        // console.log(
        //   md.toFixed(2) + ' => ' + 1e-2 * Math.abs(md) ** (md <= 0 ? 0.8 : 1.1),
        // );
        // console.log(newZ);
        const newZclamp = _.clamp(newZ, bounds.zoom.min, bounds.zoom.max);

        const realZoom = getRealZoom(newZclamp);

        // get movement of pointer origin for panning
        const [px, py]: Vector2 = vScale(-2 / realZoom, subV(origin, memo.o));
        const relMove: Vector2 = [px, -py];

        // setControlXY({
        //   //
        //   xy: addV(memo.xy, vRotate(theta.getValue(), relMove)),
        //   immediate: false,
        // });
        // updateZ({});
        updateXY({
          xy: memo.xy,
          theta: theta.getValue(),
          relMove: relMove,
          down: down,
        });

        // setControlZoom({
        //   z: newZclamp,
        //   immediate: false,
        //   config: down ? springsConfigs.user.zoom : springsConfigs.default.zoom,
        // });
        updateZ({ z: newZclamp, down: down });

        updateT({
          t: memo.t + degToRad(ma),
          down: down,
        });

        return memo;
      },

      onWheel: ({
        event,
        movement: [, my],
        active,
        shiftKey,
        memo = { zoom: z.getValue(), t: theta.getValue() },
      }: FullGestureState<StateKey<'wheel'>>) => {
        // disable native browser events
        event && event.preventDefault();

        if (shiftKey) {
          // if shift is pressed, rotate instead of zoom
          const newT = memo.t + my * 1.5e-3;

          updateT({
            t: newT,
            down: active,
          });
        } else {
          // set different multipliers based on zoom direction
          // mouse movement negative = move up the page = zoom in
          //                                   zoom        in           out
          const newZ = memo.zoom * (1 - my * (my < 0 ? zoomMult.in : zoomMult.out));

          // setControlZoom({
          //   z: _.clamp(newZ, minZoom.getValue(), maxZoom.getValue()),
          //   config: active ? springsConfigs.user.zoom : springsConfigs.default.zoom,
          //   // reset immediate value from warp function
          //   immediate: false,
          // });
          updateZ({
            z: _.clamp(newZ, bounds.zoom.min, bounds.zoom.max),
            down: active,
          });
        }
        return memo;
      },

      onDrag: ({
        event,
        down,
        movement,
        direction: [dx, dy],
        velocity,
        pinching,
        last,
        cancel,
        memo = { xy: xy.getValue(), theta: theta.getValue() },
      }: FullGestureState<StateKey<'drag'>>) => {
        // disable native browser events
        event && event.preventDefault();

        // let pinch handle movement
        if (pinching) cancel && cancel();
        // change according to this formula:
        // move (x, y) in the opposite direction of drag (pan with cursor)
        // divide by canvas size to scale appropriately
        // multiply by 2 to correct scaling on viewport (?)
        // use screen multiplier for more granularity
        const realZoom = getRealZoom(z.getValue());

        const [px, py]: Vector = vScale(-2 / realZoom, movement);
        // const relMove: Vector = vScale(2 / realZoom, movement);

        const relMove: Vector = [px, -py];
        // const relDir: Vector = [dx, -dy];

        // const t = theta.getValue();

        // const vecXY = addV(memo.xy, vRotate(t, relMove)); // add the displacement to the starting position
        // const velXY = vScale(velocity, vNorm(vecXY))

        // setControlXY({
        //   // add to the current position the relative displacement (relMove), rotated by theta,
        //   // to maintain the correct displacement direction (without this it would move as if theta=0)
        //   xy: vecXY,
        //   // immediate: down, // immediately apply if the gesture is active
        //   config: down ? springsConfigs.user.xy : springsConfigs.default.xy,
        //   // reset immediate value from warp function
        //   immediate: false,
        //   //  {
        //   //   // velocity also needs to be rotated according to theta
        //   //   // -@ts-expect-error - velocity should be `[number, number]`, but only `number` allowed
        //   //   // velocity: vScale(-velocity / realZoom, vRotate(t, relDir)), // set the velocity (gesture momentum)
        //   //   // velocity: vMag(vScale(-velocity / realZoom, vRotate(t, relDir))), // set the velocity (gesture momentum)
        //   //   // velocity: velocity / screenScaleMultiplier, // set the velocity (gesture momentum)
        //   //   // mass: down ? 1 : 5,
        //   //   ...xyCtrlSpringConfig,
        //   //   tension: down ? xyCtrlSpringConfig.tension : xyCtrlSpringConfig.tension / 2,
        //   //   // -@ts-expect-error - decay is undocumented?
        //   //   // decay: true,
        //   // },
        // });

        updateXY({
          xy: memo.xy,
          theta: theta.getValue(),
          relMove: relMove,
          down: down,
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
 * This function is "controlled" by default. It animates without
 * spring physics, instead using a duration and an easing function.
 */
export const warpToPoint = (
  // the current positions and controls
  { xyCtrl: [XY, setXY], zoomCtrl: [Z, setZ], rotCtrl: [T, setT] }: ViewerControlSprings,
  // the desired "new" positions
  { xy, z, theta }: Partial<ViewerLocation>,
  {
    // timings
    immediate = false,
    delayStart = false, // if this is an initial update, delay the start for clarity
  }: { immediate?: boolean; delayStart?: boolean },
): void => {
  // animation time
  const defaultDuration = 1250;
  // ms delay until the first animation
  const delayInterval = delayStart ? 500 : 0;

  // assume we will zoom in
  let animateIn = true;

  // scale zoom usage by displacement:
  // -- low displacement => low zoom
  // -- high displacement => zoom out, zoom back in

  const none = () => {
    // no animation
  };
  // determine which animations should be performed
  // have the animation function stored here
  // if it's never set, then it must not have been called
  const animations = {
    pan: none,
    zoom: none,
    rotate: none,
  };

  // can't do a simple "if (x)" check since values could be zero (evaluates to "false")
  if (xy !== undefined) {
    const oldXY = XY.xy.getValue();
    // distance between the two vectors determines the duration
    const dXY = vFastDist(xy, oldXY);
    console.log(`dXY: ${dXY}`);

    animations.pan = () =>
      setXY({
        // use screen scale multiplier for a simpler API
        xy: xy,
        config: {
          // ...springsConfigs.default.zoom,
          duration: (0.1 + dXY) * defaultDuration,
          easing: MaterialStandardEasing,
        },
        immediate: immediate,
        // delay: delayInterval,
      });
  }
  // if (z !== undefined) {
  //   animations.zoom();

  //   // setZ({
  //   //   z: z,
  //   //   config: {
  //   //     // ...springsConfigs.default.zoom,
  //   //     duration: defaultDuration,
  //   //     easing: MaterialStandardEasing,
  //   //   },
  //   //   // want this animation to be reasonably quick, but not too quick
  //   //   // setting a time might make it too slow in some cases
  //   //   // can we set a max velocity?
  //   //   immediate: immediate,
  //   //   delay: defaultDuration + delayInterval,
  //   // });
  // }
  if (theta !== undefined) {
    animations.rotate = () =>
      setT({
        theta: theta,
        config: {
          // ...springsConfigs.default.rot,
          easing: MaterialStandardEasing,
          duration: defaultDuration,
        },
        immediate: immediate,
        // delay: delayInterval,
      });
  }

  // determine the order of animations
  if (z !== undefined) {
    const oldZ = Z.z.getValue();
    // get a value greater than 1
    const zoomIn = z >= oldZ;
    console.log(oldZ, z);

    animateIn = zoomIn;
    // dz ~> [1, 100_001]
    const dZ = 1 + Math.abs(oldZ - z);
    // const dZ = 1 + (zoomIn ? newZ / z : z / newZ);

    // this is hyperbolic so may need adjustment other than nth-roots
    // scale duration based on the delta
    // duration = dz ^ (1/5) * N ~> [1, 10]
    // duration = dz ^ (1/6) * N ~> [1, 6.81292]
    // duration = dz ^ (1/7) * N ~> [1, 5.17947]
    // duration = dz ^ (1/8) * N ~> [1, 4.21696]
    const expo = 7;
    const speedModifier = Math.pow(dZ, 1 / expo);
    const duration = speedModifier * defaultDuration;

    console.log(dZ, duration);

    // set a maximum zoom rate, by
    // - calculating zoom difference
    // - setting a duration based on this difference
    animations.zoom = () =>
      setZ({
        z: z,
        config: {
          // ...springsConfigs.default.zoom,
          duration: duration,
          easing: zoomIn
            ? // ? MandelbrotMapsEasing.instantInSlowOut
              MandelbrotMapsEasing.slowInVariableOut(
                (speedModifier - 1) / (100_000 ** (1 / expo) - 1),
              )
            : easeExpOut,
        },
        // want this animation to be reasonably quick, but not too quick
        // setting a time might make it too slow in some cases
        // can we set a max velocity?
        immediate: immediate,
        // delay: defaultDuration + delayInterval,
      });
  }

  // // for zooming in, *pan* first
  // const animateIn = [animations.pan, animations.zoom, animations.rotate];
  // // for zooming out, *zoom* first
  // const animateOut = [animations.zoom, animations.pan, animations.rotate];
  // // default to animate in (if zoom undefined)
  const animationOrder = animateIn
    ? [animations.pan, animations.zoom, animations.rotate]
    : [animations.zoom, animations.pan, animations.rotate];

  // animations.zoom();
  // run the animations
  // Object.values(animations).map((f) => f());
  // let
  // if (animateIn) {

  // }
  // animationOrder.map((f) => console.log(f));
  console.log(animateIn ? '[pan, zoom, rotate]' : '[zoom, pan, rotate]');
  setTimeout(() => {
    animationOrder.map((f) => f());
  }, delayInterval);
};

// no longer using screenScaleMultiplier
// export const screenToReal = (x: number): number => x * screenScaleMultiplier;
// export const RealToScreen = (x: number): number => x / screenScaleMultiplier;

export const Rgb255ColourToFloat = (c: RgbColor): RgbFloatColour =>
  [c.r, c.g, c.b].map((e) => e / 255) as RgbFloatColour;
