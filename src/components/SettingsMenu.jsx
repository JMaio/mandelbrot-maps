import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles, Fab, Switch, Popover, FormGroup, FormControlLabel, Slider, Typography, Grid, Divider, Backdrop, Box } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import MyLocationIcon from '@material-ui/icons/MyLocation';

const useStyles = makeStyles(theme => ({
    root: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        display: "flex",
        flexDirection: "column",
        // position: 'absolute',
        // bottom: 0,
        // right: 0,
        zIndex: 2,
    },
    button: {
        marginTop: 10,
    },
    speedDial: {
        // position: 'absolute',
        // bottom: theme.spacing(1),
        // right: theme.spacing(1),
    },
    sliderControl: {
        width: 30,
    }
}));

// let marks = 

export default function SettingsMenu(props) {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className={classes.root}>
            <Fab aria-controls="menu" 
                size="small" 
                aria-haspopup="true"
                onClick={handleClick}
                className={classes.button}
                >
                <SettingsIcon />
            </Fab>
            <Backdrop open={Boolean(anchorEl)}>
                <Popover
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    // open={true}
                    onClose={handleClose}
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
                        <Box variant="h1" fontSize={20} align="center">Configuration</Box>

                        {props.settings.map((group, i) =>
                            <Grid item key={group.title}>
                                <Divider style={{
                                    marginTop: 10,
                                    marginBottom: 10,
                                }} />
                                <Box variant="h2" fontSize={16} align="left">{group.title}</Box>
                                <FormGroup>
                                {Object.values(group.items).map((ctrl, j) => 
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
                            marginBottom: 10,
                        }} />

                        <Button aria-controls="reset" 
                            // size="small" 
                            // aria-haspopup="true"
                            onClick={() => props.reset()}
                            className={classes.button}
                            startIcon={<MyLocationIcon />}
                            >
                            Reset position
                        </Button>
                    </Grid>
                    
                    {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>My account</MenuItem>
                    <MenuItem onClick={handleClose}>Logout</MenuItem> */}
                </Popover>
            </Backdrop>
        </div>
    );
}