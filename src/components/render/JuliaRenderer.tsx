import React, { useRef, useState } from 'react';
import { useGesture } from 'react-use-gesture';
import { JuliaRendererProps } from '../../common/render';
import { MandelbrotMapsWebGLUniforms } from '../../common/types';
import {
  synchronisedZoomTouchBind,
  frozenTouchBind,
  genericTouchBind,
  Rgb255ColourToFloat,
} from '../../common/utils';
import newSmoothJuliaShader from '../../shaders/newSmoothJuliaShader';
import { SettingsContext } from '../settings/SettingsContext';
import { AnimationStatus } from '../tans_theorem/AnimationFinalCard';
import MinimapViewer from './MinimapViewer';
import WebGLCanvas from './WebGLCanvas';

export default function JuliaRenderer({
  precision,
  ...props
}: JuliaRendererProps): JSX.Element {
  // variables to hold canvas and webgl information
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const miniCanvasRef = useRef<HTMLCanvasElement>(null);

  const [{ xy }] = props.controls.xyCtrl;
  const [{ z }] = props.controls.zoomCtrl;
  const [{ theta }] = props.controls.rotCtrl;
  const maxI = props.maxI; // -> global
  const AA = props.useAA ? 2 : 1;

  const fragShader = newSmoothJuliaShader({
    maxI: maxI,
    AA: AA,
  });

  const miniFragShader = newSmoothJuliaShader({
    maxI: maxI,
    AA: 2,
  });

  const u: MandelbrotMapsWebGLUniforms = {
    zoom: z,
    xy: xy,
    c: props.c,
    theta: theta,
    maxI: maxI,
    colour: Rgb255ColourToFloat(props.colour),
  };

  const [dragging, setDragging] = useState(false);

  const gtb = [
    AnimationStatus.ZOOM_M,
    AnimationStatus.ZOOM_J,
    AnimationStatus.ROTATE_M,
    AnimationStatus.ROTATE_J,
  ].includes(props.animationState)
    ? frozenTouchBind({
        domTarget: canvasRef,
        controls: props.controls,
        setDragging: setDragging,
        DPR: props.DPR,
        precision: precision,
      })
    : props.animationState === AnimationStatus.PLAY
    ? synchronisedZoomTouchBind({
        domTarget: canvasRef,
        controls: props.controls,
        setDragging: setDragging,
        DPR: props.DPR,
        align: props.align,
        precision: precision,
      })
    : genericTouchBind({
        domTarget: canvasRef,
        controls: props.controls,
        // gl: gl,
        setDragging: setDragging,
        DPR: props.DPR,
        precision: precision,
      });

  useGesture(gtb.handlers, gtb.config);

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
            id="julia-canvas"
            fragShader={fragShader}
            DPR={props.DPR}
            u={u}
            ref={canvasRef}
            dragging={dragging}
          />
          <MinimapViewer
            id="julia-minimap-canvas"
            fragShader={miniFragShader}
            DPR={props.DPR}
            u={u}
            canvasRef={miniCanvasRef}
            show={settings.showMinimap}
            controls={props.controls}
          />
        </div>
      )}
    </SettingsContext.Consumer>
  );
}
