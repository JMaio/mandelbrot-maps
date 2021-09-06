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
import {
  HelpOutline,
  InfoOutlined,
  MyLocationOutlined,
  SettingsOutlined,
  SvgIconComponent,
} from '@material-ui/icons';
import SettingsIcon from '@material-ui/icons/Settings';
import CompareIcon from '@material-ui/icons/Compare';
import React, { useState } from 'react';
import { SettingsMenuProps, settingsWidgetType } from '../../common/settings';
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

export const GroupDivider = (): JSX.Element => (
  <Divider style={{ marginTop: 6, marginBottom: 8 }} />
);
export const GroupTitle = (props: {
  title: string;
  icon: SvgIconComponent;
}): JSX.Element => (
  <Grid container alignItems="center" justifyContent="center" spacing={1}>
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

export const SettingsMenuButton = ({
  onClick,
  displayOnly = false,
}: {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  displayOnly?: boolean;
}): JSX.Element => {
  const classes = useStyles();

  return (
    <Fab
      aria-controls="menu"
      aria-haspopup="true"
      aria-label="settings"
      size="small"
      onClick={onClick}
      className={classes.settingsButton}
    >
      <SettingsIcon className="rotate-center" />
    </Fab>
  );
};

export const SettingsHelpButton = ({
  onClick,
}: {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}): JSX.Element => (
  <Button size="small" color="primary" startIcon={<HelpOutline />} onClick={onClick}>
    Help
  </Button>
);

export default function SettingsMenu(props: SettingsMenuProps): JSX.Element {
  const [helpOpen, setHelpOpen] = props.helpState;
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState<EventTarget & HTMLButtonElement>();

  const ResetButton = () => (
    <Button
      startIcon={<MyLocationOutlined />}
      color="secondary"
      aria-controls="reset"
      onClick={() => {
        // eslint-disable-next-line react/prop-types
        props.reset();
        setAnchorEl(undefined);
      }}
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
        // eslint-disable-next-line react/prop-types
        props.toggleInfo();
        setAnchorEl(undefined);
      }}
    >
      About
    </Button>
  );

  const TanButton = () => (
    <Button
      startIcon={<CompareIcon />}
      color="primary"
      aria-controls="tan"
      onClick={() => {
        // eslint-disable-next-line react/prop-types
        props.toggleTan();
        setAnchorEl(undefined);
      }}
    >
      Explore Tan&apos;s theorem
    </Button>
  );

  return (
    <div className={classes.root}>
      <SettingsMenuButton onClick={(e) => setAnchorEl(e.currentTarget)} />

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
          style={{ userSelect: 'none' }}
        >
          <Grid container direction="column" className={classes.popoverCardGrid}>
            <Grid
              item
              container
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              style={{ padding: '2px 0' }}
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
                <SettingsHelpButton onClick={setHelpOpen} />
              </Grid>
            </Grid>
            <SettingsContext.Consumer>
              {({ setSettings, settingsWidgets }) =>
                getSettingsWidgetsGrouping(settingsWidgets).map((g) => (
                  <Grid item key={g.name}>
                    <GroupDivider />
                    <GroupTitle icon={g.icon} title={g.name} />
                    <FormGroup>
                      {Object.entries(g.widgets).map(([k, widgetUnchecked], j) => {
                        const { helptext, ...widget } =
                          widgetUnchecked as settingsWidgetType;

                        return (
                          <FormControlLabel
                            key={`${k}-control`}
                            {...widget}
                            // ...e catches all event arguments
                            onChange={
                              helpOpen
                                ? (...e) => {
                                    /** help is open - do nothing, otherwise there may
                                     * be an infinite update loop in the iteration or
                                     * colour selectors
                                     */
                                  }
                                : (...e) => {
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
                                  }
                            }
                          />
                        );
                      })}
                    </FormGroup>
                  </Grid>
                ))
              }
            </SettingsContext.Consumer>

            <GroupDivider />

            <Grid
              container
              direction="column"
              justifyContent="space-between"
              // alignItems="stretch"
              spacing={1}
            >
              <Grid item container direction="row" justifyContent="space-around">
                <Grid item>
                  <ResetButton />
                </Grid>
                <Grid item>
                  <AboutButton />
                </Grid>
              </Grid>
              <Grid item container direction="row" justifyContent="space-around">
                <Grid item>
                  <TanButton />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Popover>
      </Backdrop>
    </div>
  );
}
