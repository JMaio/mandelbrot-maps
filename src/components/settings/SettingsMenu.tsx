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
import {
  HelpOutline,
  InfoOutlined,
  MyLocationOutlined,
  SettingsOutlined,
  SvgIconComponent,
} from '@material-ui/icons';
import SettingsIcon from '@material-ui/icons/Settings';
import React, { useState } from 'react';
import { SettingsMenuProps } from '../../common/settings';
// react-colorful requires style imports
// import 'react-colorful/dist/index.css';
import '../../css/react-colorful.css';
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
    paddingTop: 18,
    paddingBottom: 18,
    paddingRight: 22,
    paddingLeft: 22,
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
);

export default function SettingsMenu(props: SettingsMenuProps): JSX.Element {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState<EventTarget & HTMLButtonElement>();

  const ResetButton = () => (
    <Button
      startIcon={<MyLocationOutlined />}
      color="secondary"
      aria-controls="reset"
      onClick={props.reset}
    >
      Reset
    </Button>
  );
  const AboutButton = () => (
    <Button
      startIcon={<InfoOutlined />}
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
            <Grid
              item
              container
              direction="row"
              alignItems="center"
              justify="space-between"
              style={{ padding: '4px 0' }}
            >
              {/* https://stackoverflow.com/a/51970114/9184658 */}
              <Grid item xs container direction="row" alignItems="center">
                <Grid item>
                  <SettingsOutlined
                    className="rotate-center"
                    style={{ marginRight: 4 }}
                  />
                </Grid>
                <Grid item>
                  <Typography variant="h1" style={{ fontSize: 20 }}>
                    Settings
                  </Typography>
                </Grid>
              </Grid>
              <Grid item>
                <Button
                  size="small"
                  color="primary"
                  startIcon={<HelpOutline />}
                  onClick={props.showHelp}
                >
                  Help
                </Button>
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
                          // ...e catches all event arguments
                          onChange={(...e) => {
                            // the value is the last element of the "e" array
                            // https://stackoverflow.com/a/12099341/9184658
                            // > using destructuring is nice too:
                            // > const [lastItem] = arr.slice(-1)
                            // > – diachedelic Mar 11 '19 at 6:30
                            const [val] = e.slice(-1);
                            console.debug(`${k} ->`, val);
                            // TODO: updating state like this seems to be very slow
                            // either have individual useState pairs, or use a Map?
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
