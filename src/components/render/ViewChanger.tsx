import { Button, ButtonGroup, makeStyles } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import React from 'react';
import { ViewChangerProps } from '../../common/render';

const useStyles = makeStyles((theme) => ({
  // root: {
  //   transform: 'translateX(-50%) translateY(-50%)',
  // },
  changeViewButton: {
    padding: 4,
  },
}));

export default function ViewChanger({
  vertical,
  changeFunc,
}: ViewChangerProps): JSX.Element {
  // const { vertical, changeFunc, debug, percentFlex } = props;
  const classes = useStyles();

  const mButton = (
    <Button
      className={classes.changeViewButton}
      onClick={() => {
        // console.log('julia (up / right)');
        // always show mandelbrot
        // show julia if (self) hidden, otherwise hide it
        // [true, true] => [true, false]
        // [false, true] => [true, true]
        changeFunc(([m, j]: boolean[]) => [true, !m]);
      }}
    >
      {vertical ? <KeyboardArrowUpIcon /> : <KeyboardArrowRightIcon />}
    </Button>
  );
  const jButton = (
    <Button
      className={classes.changeViewButton}
      onClick={() => {
        // console.log('mandelbrot (down / left)');
        // [true, true] => [false, true]
        // [true, false] => [true, true]
        changeFunc(([m, j]: boolean[]) => [!j, true]);
      }}
    >
      {vertical ? <KeyboardArrowDownIcon /> : <KeyboardArrowLeftIcon />}
    </Button>
  );

  return (
    <ButtonGroup
      orientation={vertical ? 'vertical' : 'horizontal'}
      variant="contained"
      style={{
        transform:
          // `rotate(${props.vertical ? 0 : 90}deg)` +
          vertical ? `translate(-100%, -50%)` : `translate(-50%, 0%)`, // original
        // vertical ? `translate(-125%, -50%)` : `translate(-50%, 25%)`,
        // vertical ? `translate(-150%, -50%)` : `translate(-50%, 50%)`,
        marginTop: vertical ? 0 : 12,
        // clear the settings button
        marginLeft: vertical ? -72 : 0,
        // zIndex: 1,
        // margin: vertical ? `auto auto auto -${margin}px` : `${margin}px auto auto auto`,
        // width: 50,
        // height: 50,
      }}
    >
      {vertical ? mButton : jButton}
      {vertical ? jButton : mButton}
      {/* <Button>
        <animated.div>{percentFlex.m.interpolate((x: number) => x)}</animated.div>
        <animated.div>{percentFlex.j.interpolate((x: number) => x)}</animated.div>
      </Button> */}
    </ButtonGroup>
  );
}
