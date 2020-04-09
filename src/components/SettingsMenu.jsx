import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles, Fab, Popover, FormGroup, FormControlLabel, Typography, Grid, Divider, Backdrop, IconButton } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import InfoIcon from '@material-ui/icons/Info';

const useStyles = makeStyles(theme => ({
    root: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        display: "flex",
        flexDirection: "column",
        zIndex: 2,
    },
    button: {
        marginTop: 10,
    },
    sliderControl: {
        width: 30,
    }
}));

export default function SettingsMenu(props) {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);

    return (
        <div className={classes.root}>
            <Fab aria-controls="menu" 
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
                        horizontal: "right",
                        vertical: "bottom"
                    }}
                    transformOrigin={{
                        vertical: "bottom",
                        horizontal: "right"
                    }}
                >
                    <Grid container direction="column" style={{
                        paddingLeft: "1.5em",
                        paddingRight: "1.5em",
                        paddingTop: "1em",
                        paddingBottom: "1em",
                    }}>
                        <Grid item container alignItems="center" justify="space-around">
                            <Grid item>
                                <Typography variant="h1" style={{ fontSize: 20, paddingLeft: 20, paddingRight: 20 }}>
                                    Configuration
                                </Typography>
                            </Grid>
                            <Divider orientation="vertical" flexItem />
                            <Grid item>
                                <IconButton aria-label="info" size="medium" onClick={() => {
                                    // open info panel
                                    props.toggleInfo();
                                    // close popover
                                    setAnchorEl(null);
                                }}>
                                    <InfoIcon fontSize="inherit" />
                                </IconButton>
                            </Grid>

                        </Grid>

                        {props.settings.map((group) =>
                            <Grid item key={group.title}>
                                <Divider style={{
                                    marginTop: 10,
                                    marginBottom: 4,
                                }} />
                                <Typography variant="overline" style={{ fontSize: 14, marginBottom: 4 }}>{group.title}</Typography>
                                <FormGroup>
                                {Object.values(group.items).map((ctrl) => 
                                    <FormControlLabel 
                                        label={ctrl.name}
                                        key={ctrl.name}
                                        control={ctrl.ctrl}
                                        labelPlacement={ctrl.placement ? ctrl.placement : "end"}
                                        style={ctrl.placement ? {
                                            marginLeft: 0,
                                            marginRight: 0,
                                        } : {}}
                                    />
                                )}
                                </FormGroup>
                            </Grid>
                        )}

                        <Divider style={{
                            marginTop: 10,
                            marginBottom: 4,
                        }} />

                        <Button aria-controls="reset" 
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