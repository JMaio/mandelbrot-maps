import { Box, ButtonBase, Grow, makeStyles } from '@material-ui/core';
import React from 'react';
import { MinimapViewerProps } from '../../common/render';
import { simpleBoxShadow } from '../../theme/theme';
import RotationCompass from './RotationCompass';
import WebGLCanvas from './WebGLCanvas';

const miniSize = 100;
const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: theme.shape.borderRadius,
  },
}));

const MinimapViewer = ({
  canvasRef,
  show,
  controls,
  ...props
}: MinimapViewerProps): JSX.Element => {
  const classes = useStyles();
  const {
    zoomCtrl: [, setZoom],
    rotCtrl: [theta, setTheta],
  } = controls;

  return (
    <Grow in={show}>
      <Box
        style={{
          position: 'absolute',
          // make minimap stick out through backdrop
          zIndex: 1300,
          margin: '0.5rem',
          left: 0,
          bottom: 0,
          display: 'flex',
        }}
      >
        <RotationCompass theta={theta.theta} onClick={() => setTheta({ theta: 0 })} />
        <ButtonBase
          style={{
            position: 'relative',
            // cursor: 'pointer',
            height: miniSize,
            width: miniSize,
            // borderRadius: borderRadius,
            // border: "1px solid #000",
            boxShadow: simpleBoxShadow,
            overflow: 'hidden',
            // opacity: zoom.interpolate((z) => _.clamp(z - 1, 0, 1)),
            // display: zoom.interpolate((z) => (_.clamp(z - 1, 0, 1) === 0 ? 'none' : 'block')),
          }}
          onClick={() => setZoom({ z: 1 })}
          className={classes.root}
        >
          <WebGLCanvas
            mini={true}
            ref={canvasRef}
            {...props}
            // setting border radius here stops the canvas clickable area from overflowing
            // outside the div circle, which would make the clickable area a rectangle
            style={{
              // borderRadius: borderRadius,
              // cursor should be "pointer" (looks clickable) if this is a minimap,
              cursor: 'pointer',
            }}
          />
        </ButtonBase>
      </Box>
    </Grow>
  );
};
export default MinimapViewer;
