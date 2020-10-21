import React, { useEffect, useRef, useState } from 'react';
import { useGesture } from 'react-use-gesture';
import { JuliaRendererProps } from '../../common/render';
import { MandelbrotMapsWebGLUniforms } from '../../common/types';
import { screenScaleMultiplier } from '../../common/values';
import newSmoothJuliaShader from '../../shaders/newSmoothJuliaShader';
import { SettingsContext } from '../settings/SettingsContext';
import { genericTouchBind } from '../utils';
import MinimapViewer from './MinimapViewer';
import WebGLCanvas from './WebGLCanvas';

export default function JuliaRenderer(props: JuliaRendererProps): JSX.Element {
  // variables to hold canvas and webgl information
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const miniCanvasRef = useRef<HTMLCanvasElement>(null);

  // const gl = useRef();
  // const miniGl = useRef();

  // this multiplier subdivides the screen space into smaller increments
  // to allow for velocity calculations to not immediately decay, due to the
  // otherwise small scale that is being mapped to the screen.
  // const screenScaleMultiplier = props.screenScaleMultiplier;

  // read incoming props
  const [{ xy }] = props.controls.xyCtrl;
  // const [{ theta, last_pointer_angle }, setControlRot] = props.controls.rot;
  const [{ z }, setControlZoom] = props.controls.zoomCtrl;
  const [{ theta }] = props.controls.rotCtrl;
  const maxI = props.maxI; // -> global
  const AA = props.useAA ? 2 : 1;

  const fragShader = newSmoothJuliaShader({
    maxI: maxI,
    AA: AA,
    // showCrosshair: false,
  });

  const miniFragShader = newSmoothJuliaShader({
    maxI: maxI,
    AA: 2,
    // showCrosshair: false,
  });

  const u: MandelbrotMapsWebGLUniforms = {
    zoom: z,
    xy: xy,
    c: props.c,
    theta: theta,
    maxI: maxI,
    // screenScaleMultiplier: screenScaleMultiplier,
  };

  const [dragging, setDragging] = useState(false);

  const gtb = genericTouchBind({
    domTarget: canvasRef,
    controls: props.controls,
    screenScaleMultiplier:
      screenScaleMultiplier / (props.useDPR ? window.devicePixelRatio : 1),
    setDragging: setDragging,
  });

  const touchBind = useGesture(gtb.handlers, gtb.config);

  useEffect(() => {
    touchBind();
  }, [touchBind]);

  return (
    <SettingsContext.Consumer>
      {({ settings }) => (
        <div
          className="renderer"
          style={{
            position: 'relative',
          }}
        >
          <WebGLCanvas
            id="julia"
            fragShader={fragShader}
            useDPR={props.useDPR}
            u={u}
            ref={canvasRef}
            dragging={dragging}
          />
          <MinimapViewer
            fragShader={miniFragShader}
            useDPR={settings.useDPR}
            u={u}
            canvasRef={miniCanvasRef}
            onClick={() => setControlZoom({ z: 1 })}
            show={settings.showMinimap}
          />
        </div>
      )}
    </SettingsContext.Consumer>
  );
}
