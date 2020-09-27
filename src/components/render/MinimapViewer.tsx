import React from 'react';
import { animated } from 'react-spring';
import { MinimapViewerProps } from '../../common/render';
import WebGLCanvas from '../WebGLCanvas';

const miniSize = 100;

const MinimapViewer = (props: MinimapViewerProps): JSX.Element => {
  const { canvasRef, onClick, ...rest } = props;
  return (
    <animated.div
      style={{
        position: 'absolute',
        zIndex: 2,
        margin: '0.5rem',
        left: 0,
        bottom: 0,
        cursor: 'pointer',
        height: miniSize,
        width: miniSize,
        borderRadius: miniSize,
        // border: "1px solid #000",
        boxShadow: '0px 2px 10px 1px rgba(0, 0, 0, 0.4)',
        overflow: 'hidden',
        // opacity: zoom.interpolate((z) => _.clamp(z - 1, 0, 1)),
        // display: zoom.interpolate((z) => (_.clamp(z - 1, 0, 1) === 0 ? 'none' : 'block')),
      }}
      onClick={onClick}
    >
      <WebGLCanvas mini={true} ref={canvasRef} {...rest} />
    </animated.div>
  );
};
export default MinimapViewer;
