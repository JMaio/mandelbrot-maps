import {
  Backdrop,
  Divider,
  Fab,
  FormControlLabel,
  FormControlLabelProps,
  FormGroup,
  Grid,
  makeStyles,
  Popover,
  Typography,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { SvgIconComponent } from '@material-ui/icons';
import InfoIcon from '@material-ui/icons/Info';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import SettingsIcon from '@material-ui/icons/Settings';
import React, { useState } from 'react';
import { SettingsMenuProps } from '../../common/settings';
import { contrastBoxShadow } from '../../theme/theme';
import { SettingsContext } from './SettingsContext';
import { getSettingsWidgetsGrouping } from './SettingsDefinitions';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    zIndex: 2,
  },
  settingsButton: {
    boxShadow: contrastBoxShadow,
  },
  popoverCardGrid: {
    paddingTop: 24,
    paddingBottom: 16,
    paddingRight: 24,
    paddingLeft: 24,
  },
  sliderControl: {
    width: 30,
  },
}));

const GroupDivider = () => <Divider style={{ marginTop: 8, marginBottom: 12 }} />;
const GroupTitle = (props: { title: string; icon: SvgIconComponent }) => (
  <Grid container alignItems="center" justify="center" spacing={1}>
    {/* remove margin to center based only on text and not icon (not ideal) */}
    <Grid item style={{ marginLeft: -24 }}>
      <props.icon color="primary" fontSize="small" />
    </Grid>
    <Grid item>
      <Typography color="primary" variant="button" style={{ fontSize: 14 }}>
        {props.title}
      </Typography>
    </Grid>
  </Grid>
  // <Box
  //   style={{
  //     display: 'flex',
  //     verticalAlign: 'middle',
  //   }}
  // >
  //   <props.icon fontSize="small" />
  //   <Typography variant="button" style={{ fontSize: 14, marginLeft: 4 }}>
  //     {props.title}
  //   </Typography>
  // </Box>
);

export default function SettingsMenu(props: SettingsMenuProps): JSX.Element {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState<EventTarget & HTMLButtonElement>();

  const ResetButton = () => (
    <Button
      startIcon={<MyLocationIcon />}
      color="secondary"
      aria-controls="reset"
      onClick={() => {
        props.reset();
      }}
    >
      Reset
    </Button>
  );
  const AboutButton = () => (
    <Button
      startIcon={<InfoIcon />}
      color="primary"
      aria-controls="about"
      onClick={() => {
        props.toggleInfo();
        setAnchorEl(undefined);
      }}
    >
      About
    </Button>
  );

  return (
    <div className={classes.root}>
      <Fab
        aria-controls="menu"
        aria-haspopup="true"
        aria-label="settings"
        size="small"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        // style={{
        //   boxShadow: heavyBoxShadow,
        // }}
        className={classes.settingsButton}
      >
        <SettingsIcon />
      </Fab>
      <Backdrop open={Boolean(anchorEl)}>
        <Popover
          id="menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(undefined)}
          anchorOrigin={{
            horizontal: 'right',
            vertical: 'bottom',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <Grid container direction="column" className={classes.popoverCardGrid}>
            <Grid item container alignItems="center" justify="space-around">
              <Grid item>
                <Typography variant="h1" style={{ fontSize: 20 }}>
                  Configuration
                </Typography>
              </Grid>
            </Grid>
            <SettingsContext.Consumer>
              {({ setSettings, settingsWidgets }) =>
                getSettingsWidgetsGrouping(settingsWidgets).map((g) => (
                  <Grid item key={g.name}>
                    <GroupDivider />
                    <GroupTitle icon={g.icon} title={g.name} />
                    <FormGroup>
                      {Object.entries(g.widgets).map(([k, widget]) => (
                        <FormControlLabel
                          key={`${k}-control`}
                          style={{ userSelect: 'none' }}
                          {...(widget as FormControlLabelProps)}
                          onChange={(e, val) => {
                            console.log(`${k} -> ${val}`);
                            setSettings((prevState) => ({
                              ...prevState,
                              [k]: val,
                            }));
                          }}
                        />
                      ))}
                    </FormGroup>
                  </Grid>
                ))
              }
            </SettingsContext.Consumer>

            <GroupDivider />

            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="stretch"
              spacing={1}
            >
              <Grid item>
                <ResetButton />
              </Grid>
              <Grid item>
                <AboutButton />
              </Grid>
            </Grid>
          </Grid>
        </Popover>
      </Backdrop>
    </div>
  );
}
