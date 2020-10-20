import {
  Backdrop,
  Divider,
  Fab,
  FormControlLabel,
  FormGroup,
  Grid,
  makeStyles,
  Popover,
  Typography,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import InfoIcon from '@material-ui/icons/Info';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import SettingsIcon from '@material-ui/icons/Settings';
import React, { useState } from 'react';
import { SettingsMenuProps } from '../../common/settings';
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
  button: {
    padding: '6px 12px',
    marginTop: 10,
  },
  sliderControl: {
    width: 30,
  },
}));

const GroupDivider = () => <Divider style={{ marginTop: 10, marginBottom: 4 }} />;
const GroupTitle = (props: { title: string }) => (
  <Typography variant="overline" style={{ fontSize: 14, marginBottom: 4 }}>
    {props.title}
  </Typography>
);

export default function SettingsMenu(props: SettingsMenuProps): JSX.Element {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState<EventTarget & HTMLButtonElement>();

  // interface BottomButtonProps extends {
  //   icon: JSX.Element;
  //   text: string;
  //   color: 'inherit' | 'default' | 'primary' | 'secondary' | undefined;
  //   onClick: () => void;
  // }
  // const BottomButton = (props: BottomButtonProps) => (
  //   <Button
  //     variant="outlined"
  //     color={props.color}
  //     aria-controls={props.text.toLowerCase()}
  //     onClick={() => props.onClick()}
  //     className={classes.button}
  //     startIcon={<MyLocationIcon />}
  //   >
  //     Reset
  //   </Button>
  // );

  const ResetButton = () => (
    <Button
      startIcon={<MyLocationIcon />}
      color="secondary"
      aria-controls="reset"
      onClick={() => {
        props.reset();
      }}
      className={classes.button}
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
      className={classes.button}
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
        // className={classes.button}
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
          <Grid
            container
            direction="column"
            style={{
              paddingLeft: '1.5em',
              paddingRight: '1.5em',
              paddingTop: '1em',
              paddingBottom: '1em',
            }}
          >
            <Grid item container alignItems="center" justify="space-around">
              <Grid item>
                <Typography variant="h1" style={{ fontSize: 20, padding: 10 }}>
                  Configuration
                </Typography>
              </Grid>
              {/* <Divider orientation="vertical" flexItem /> */}
              {/* <Grid item>
                <IconButton
                  aria-label="info"
                  size="medium"
                  onClick={() => {
                    // open info panel
                    props.toggleInfo();
                    // close popover
                    setAnchorEl(undefined);
                  }}
                >
                  <InfoIcon fontSize="inherit" />
                </IconButton>
              </Grid> */}
            </Grid>
            <SettingsContext.Consumer>
              {({ setSettings, settingsWidgets }) =>
                getSettingsWidgetsGrouping(settingsWidgets).map((g) => (
                  <Grid item key={g.name}>
                    <GroupDivider />
                    <GroupTitle title={g.name} />
                    <FormGroup>
                      {g.widgets.map((widget) => (
                        <FormControlLabel
                          key={`${widget.label}-control`}
                          style={{ userSelect: 'none' }}
                          {...widget}
                          onChange={(e, val) => {
                            console.log(`${widget.k} -> ${val}`);
                            setSettings((prevState) => ({
                              ...prevState,
                              [widget.k]: val,
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

            <Grid container direction="row" justify="space-between" alignItems="stretch">
              <Grid item>
                <ResetButton />
              </Grid>
              <Grid item style={{ width: '0.5rem' }} />
              <Grid item>
                <AboutButton />
              </Grid>
            </Grid>

            {/* <Button
              aria-controls="reset"
              onClick={() => props.reset()}
              className={classes.button}
              startIcon={<MyLocationIcon />}
            >
              Reset
            </Button> */}
            {/* <Grid item xs>
                <Button
                  aria-controls="reset"
                  onClick={() => props.reset()}
                  className={classes.button}
                  startIcon={<MyLocationIcon />}
                >
                  Reset
                </Button>
              </Grid>
              <Grid item xs>
                <Button
                  aria-label="info"
                  size="medium"
                  onClick={() => {
                    // open info panel
                    props.toggleInfo();
                    // close popover
                    setAnchorEl(undefined);
                  }}
                  className={classes.button}
                  startIcon={<InfoIcon />}
                >
                  About
                </Button>
              </Grid> */}
          </Grid>
        </Popover>
      </Backdrop>
    </div>
  );
}
