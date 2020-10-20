import { ButtonBase, Grow } from '@material-ui/core';
import React from 'react';
import { MinimapViewerProps } from '../../common/render';
import { simpleBoxShadow } from '../../theme/theme';
import WebGLCanvas from './WebGLCanvas';

const miniSize = 100;
// TODO: make square with rounded corners?
const borderRadius = 8;

const MinimapViewer = (props: MinimapViewerProps): JSX.Element => {
  const { canvasRef, onClick, show, ...rest } = props;
  return (
    <Grow in={show}>
      <ButtonBase
        style={{
          position: 'absolute',
          // make minimap stick out through backdrop
          zIndex: 1300,
          margin: '0.5rem',
          left: 0,
          bottom: 0,
          // cursor: 'pointer',
          height: miniSize,
          width: miniSize,
          borderRadius: borderRadius,
          // border: "1px solid #000",
          boxShadow: simpleBoxShadow,
          overflow: 'hidden',
          // opacity: zoom.interpolate((z) => _.clamp(z - 1, 0, 1)),
          // display: zoom.interpolate((z) => (_.clamp(z - 1, 0, 1) === 0 ? 'none' : 'block')),
        }}
        onClick={onClick}
      >
        {/* <animated.div */}
        {/* // 
      // > */}
        <WebGLCanvas
          mini={true}
          ref={canvasRef}
          {...rest}
          // setting border radius here stops the canvas clickable area from overflowing
          // outside the div circle, which would make the clickable area a rectangle
          style={{
            borderRadius: borderRadius,
            // cursor should be "pointer" (looks clickable) if this is a minimap,
            cursor: 'pointer',
          }}
        />
        {/* </animated.div> */}
      </ButtonBase>
    </Grow>
  );
};
export default MinimapViewer;
