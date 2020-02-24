import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles, Fab, Switch, Popover, FormGroup, FormControlLabel, Slider, Typography, Grid, Divider, Backdrop } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';

const useStyles = makeStyles(theme => ({
    root: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
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

    
    // {name: 'Iterations', option: <Slider className={classes.sliderControl} />},
    // [
    // ]

    return (
        <div className={classes.root}>
            <Fab aria-controls="menu" 
                size="small" 
                aria-haspopup="true"
                onClick={handleClick}
                >
                <SettingsIcon />
            </Fab>
            <Backdrop open={Boolean(anchorEl)}>
                <Popover
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
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
                        <Typography variant="button" align="center">Configuration</Typography>
                        
                        {props.settings.map((group, i) =>
                            <Grid item key={group.title}>
                                <Divider style={{
                                    marginTop: 10,
                                    marginBottom: 10,
                                }} />
                                <Typography variant="button" align="center">{group.title}</Typography>
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

                        {/* <Divider style={{
                            marginTop: 10,
                            marginBottom: 10,
                        }} />

                        <Grid item>
                            <Typography gutterBottom>
                                Iterations
                            </Typography>
                            <Slider 
                                min={4}
                                max={1000}
                                step={4}
                                defaultValue={150}
                                // scale={i => (i ** 1.5).toFixed(0)}
                                valueLabelDisplay="auto"
                                // style={{
                                //     // paddingLeft: 4,
                                //     // paddingRight: 4,
                                // }}

                                // track={false}

                                marks={marks}
                            />
                        </Grid> */}
                    </Grid>
                    
                    {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>My account</MenuItem>
                    <MenuItem onClick={handleClose}>Logout</MenuItem> */}
                </Popover>
            </Backdrop>
        </div>
    );
}