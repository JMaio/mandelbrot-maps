import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { addV } from 'react-use-gesture';
import { vRotate, vScale } from 'vec-la-fp';

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

// a touchbind for re-using across renderers
export function genericTouchBind({
  domTarget,
  posControl,
  zoomControl,
  rotCtrl,
  screenScaleMultiplier,
  // gl,
  setDragging,
}) {
  const [{ xy }, setControlXY] = posControl;
  const [{ z, minZoom, maxZoom }, setControlZoom] = zoomControl;
  const [{ theta }, setRotCtrl] = rotCtrl || [{ theta: { getValue: () => 0 } }, () => {}];
  return {
    binds: {
      // prevent some browser events such as swipe-based navigation or
      // pinch-based zoom and instead redirect them to this handler
      onDragStart: ({ event }) => event.preventDefault(),
      onPinchStart: ({ event }) => event.preventDefault(),

      onPinch: ({
        vdva: [vd],
        down,
        delta: [dx],
        origin,
        first,
        memo = [xy.getValue()],
        zoom = z.getValue(),
      }) => {
        if (first) {
          let [p] = memo;
          return [p, origin];
        }
        // initial origin access
        // let [p, initialOrigin] = memo;
        let newZ = zoom * (1 + dx * 5e-3);
        let newZclamp = _.clamp(newZ, minZoom.getValue(), maxZoom.getValue());

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

      onWheel: ({ movement: [, my], active, zoom = z.getValue() }) => {
        // x, y obtained from event
        let newZ = zoom * (1 - my * (my < 0 ? 3e-4 : 2e-4));

        setControlZoom({
          z: _.clamp(newZ, minZoom.getValue(), maxZoom.getValue()),
          immediate: active,
          config: {
            // velocity: active ? 0 : 10,
          },
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
      }) => {
        // let pinch handle movement
        if (pinching) return;
        // change according to this formula:
        // move (x, y) in the opposite direction of drag (pan with cursor)
        // divide by canvas size to scale appropriately
        // multiply by 2 to correct scaling on viewport (?)
        // use screen multiplier for more granularity
        let realZoom = domTarget.current.height * z.getValue() * screenScaleMultiplier;

        let plotMovement = vScale(-2 / realZoom, movement);

        let relMove = [plotMovement[0], -plotMovement[1]];
        let relDir = [direction[0], -direction[1]];

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
