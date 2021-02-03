import { ButtonBase, Grow, makeStyles } from '@material-ui/core';
import React from 'react';
import { MinimapViewerProps } from '../../common/render';
import { simpleBoxShadow } from '../../theme/theme';
import WebGLCanvas from './WebGLCanvas';

const miniSize = 100;
const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: theme.shape.borderRadius,
  },
}));

const MinimapViewer = (props: MinimapViewerProps): JSX.Element => {
  const { canvasRef, onClick, show, ...rest } = props;
  const classes = useStyles();

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
          // borderRadius: borderRadius,
          // border: "1px solid #000",
          boxShadow: simpleBoxShadow,
          overflow: 'hidden',
          // opacity: zoom.interpolate((z) => _.clamp(z - 1, 0, 1)),
          // display: zoom.interpolate((z) => (_.clamp(z - 1, 0, 1) === 0 ? 'none' : 'block')),
        }}
        onClick={onClick}
        className={classes.root}
      >
        <WebGLCanvas
          id={props.id}
          mini={true}
          ref={canvasRef}
          {...rest}
          // setting border radius here stops the canvas clickable area from overflowing
          // outside the div circle, which would make the clickable area a rectangle
          style={{
            // borderRadius: borderRadius,
            // cursor should be "pointer" (looks clickable) if this is a minimap,
            cursor: 'pointer',
          }}
        />
      </ButtonBase>
    </Grow>
  );
};
export default MinimapViewer;
