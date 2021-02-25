import { ButtonBase, makeStyles, useTheme } from '@material-ui/core';
import React from 'react';
import { animated } from 'react-spring';
import { RotationCompassProps } from '../../common/render';
import { radToDeg } from '../../common/utils';

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: theme.shape.borderRadius,
  },
  // awesome compass css @ Taylor Liesnham, from https://codepen.io/Chub/pen/eiHna
  arrowUp: {
    width: 0,
    height: 0,
    borderLeft: '4px solid transparent',
    borderRight: '4px solid transparent',
    borderBottom: `12px solid ${theme.palette.secondary.main}`,
    position: 'relative',
  },

  arrowDown: {
    width: 0,
    height: 0,
    transform: 'rotate(180deg)',
    borderLeft: '4px solid transparent',
    borderRight: '4px solid transparent',
    // borderBottom: '14px solid #F3F3F3',
    // borderBottom: '14px solid #3D3D3D',
    borderBottom: `12px solid ${theme.palette.grey[100]}`,
    position: 'relative',
  },
}));

// odd-numbered width/heigh gives it a fixed central point to rotate upon;
// also makes it look far sharper
const compassDiameter = 29;

const RotationCompass = ({ theta, onClick }: RotationCompassProps): JSX.Element => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <ButtonBase
      style={{
        position: 'absolute',
        // right: '50%',
        right: 0,
        transform: 'translate(25%, -25%)',
        height: compassDiameter,
        width: compassDiameter,
        zIndex: 1301,
        borderRadius: compassDiameter,
        // cursor: 'pointer',
        // border: "1px solid #000",
        // boxShadow: simpleBoxShadow,
        // overflow: 'hidden',
        // opacity: zoom.interpolate((z) => _.clamp(z - 1, 0, 1)),
        // display: zoom.interpolate((z) => (_.clamp(z - 1, 0, 1) === 0 ? 'none' : 'block')),
        backgroundColor: theme.palette.grey[800],
        // backgroundColor: '#3D3D3D',
      }}
      onClick={onClick}
    >
      <animated.div
        style={{
          position: 'relative',
          transform: theta.interpolate((t) => `rotate(${radToDeg(t)}deg)`),
        }}
      >
        <div className={classes.arrowUp} />
        <div className={classes.arrowDown} />
      </animated.div>
    </ButtonBase>
  );
};
export default RotationCompass;
