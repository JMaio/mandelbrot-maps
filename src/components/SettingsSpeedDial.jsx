import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SettingsIcon from '@material-ui/icons/Settings';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import BlurLinearIcon from '@material-ui/icons/BlurLinear';
import TimelineIcon from '@material-ui/icons/Timeline';
import InfoIcon from '@material-ui/icons/Info';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(1),
    // position: 'absolute',
    // bottom: 0,
    // right: 0,
    zIndex: 2,
  },
  speedDial: {
    // position: 'absolute',
    // bottom: theme.spacing(1),
    // right: theme.spacing(1),
  },
}));

export default function SettingsSpeedDial() {
  const actions = [
    { icon: <BlurLinearIcon />, name: 'Antialiasing', enabled: useState(true) },
    { icon: <TimelineIcon />, name: 'Iterations', enabled: useState(true) },
    { icon: <SwapHorizIcon />, name: 'View', enabled: useState(true) },
    { icon: <InfoIcon />, name: 'About', enabled: useState(true) },
    // { icon: <SaveIcon />, name: 'Save' },
    // { icon: <PrintIcon />, name: 'Print' },
    // { icon: <ShareIcon />, name: 'Share' },
    // { icon: <FavoriteIcon />, name: 'Like' },
  ];

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = (e, reason) => {
    if (reason === 'toggle') {
      setOpen(true);
    }
  };

  const handleClose = (e, reason) => {
    if (['toggle', 'escapeKeyDown'].includes(reason)) {
      setOpen(false);
    }
  };

  return (
    <div className={classes.root}>
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        className={classes.speedDial}
        icon={<SettingsIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        // TransitionComponent={<Slide />}
        FabProps={{
          size: 'small',
          style: {
            backgroundColor: '#2773bb',
          },
        }}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={() => {
              console.log(action.enabled[0]);
              action.enabled[1](!action.enabled[0]);
            }}
            FabProps={{
              style: {
                backgroundColor: action.enabled[0] ? '#4fc3f7' : '#f8f8f8',
              },
            }}
          />
        ))}
      </SpeedDial>
    </div>
  );
}
