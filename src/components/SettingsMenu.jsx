import {
  Backdrop,
  Divider,
  Fab,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  makeStyles,
  Popover,
  Typography,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import InfoIcon from '@material-ui/icons/Info';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import SettingsIcon from '@material-ui/icons/Settings';
import React from 'react';
import { getSettingsWidgetsGrouping } from './SettingsDefinitions';
import { SettingsContext } from './SettingsContext';

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
    marginTop: 10,
  },
  sliderControl: {
    width: 30,
  },
}));

const GroupDivider = () => <Divider style={{ marginTop: 10, marginBottom: 4 }} />;
const GroupTitle = (props) => (
  <Typography variant="overline" style={{ fontSize: 14, marginBottom: 4 }}>
    {props.title}
  </Typography>
);

export default function SettingsMenu(props) {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);

  // const settings = useSettings();
  // const settingsGroups = getSettingsGrouping(settings);

  return (
    <div className={classes.root}>
      <Fab
        aria-controls="menu"
        aria-haspopup="true"
        aria-label="settings"
        size="small"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        className={classes.button}
      >
        <SettingsIcon />
      </Fab>
      <Backdrop open={Boolean(anchorEl)}>
        <Popover
          id="menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
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
                <Typography
                  variant="h1"
                  style={{ fontSize: 20, paddingLeft: 20, paddingRight: 20 }}
                >
                  Configuration
                </Typography>
              </Grid>
              <Divider orientation="vertical" flexItem />
              <Grid item>
                <IconButton
                  aria-label="info"
                  size="medium"
                  onClick={() => {
                    // open info panel
                    props.toggleInfo();
                    // close popover
                    setAnchorEl(null);
                  }}
                >
                  <InfoIcon fontSize="inherit" />
                </IconButton>
              </Grid>
            </Grid>
            <SettingsContext.Consumer>
              {({ settings, setSettings, settingsWidgets }) =>
                getSettingsWidgetsGrouping(settingsWidgets).map((g) => (
                  <Grid item key={g.name}>
                    <GroupDivider />
                    <GroupTitle title={g.name} />
                    <FormGroup>
                      {Object.entries(g.widgets).map(([k, widget]) => (
                        <FormControlLabel
                          key={`${widget.label}-control`}
                          style={{ userSelect: 'none' }}
                          {...widget}
                          onChange={(e, val) => {
                            console.log(`${k} -> ${val}`);
                            setSettings((prevState) => ({ ...prevState, [k]: val }));
                            // console.log(settings);
                          }}
                        />
                      ))}
                    </FormGroup>
                  </Grid>
                ))
              }
            </SettingsContext.Consumer>

            <GroupDivider />

            <Button
              aria-controls="reset"
              onClick={() => props.reset()}
              className={classes.button}
              startIcon={<MyLocationIcon />}
            >
              Reset position
            </Button>
          </Grid>
        </Popover>
      </Backdrop>
    </div>
  );
}
