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

let marks = [
    { value: 200, label: 200 },
    { value: 800, label: 800 },
]

export default function SettingsMenu(props) {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    let items = [
        // [
            {name: 'Anti-aliasing', option: <Switch />},
            // {name: 'Iterations', option: <Slider className={classes.sliderControl} />},
            {name: 'Split view', option: <Switch />},
            {name: 'Show coordinates', option: <Switch />},
        // ]
    ]

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
                        horizontal: "center"
                    }}
                    style={{
                        // marginBottom: 20,
                    }}
                >
                    <Grid container direction="column" style={{
                        paddingLeft: "1.5em",
                        paddingRight: "1.5em",
                        paddingTop: "1em",
                        paddingBottom: "1em",
                    }}>
                        <Typography variant="h5" align="center">Configuration</Typography>
                        
                        <Divider 
                            style={{
                                marginTop: 10,
                                marginBottom: 10,
                            }} 
                        />

                        <FormGroup style={{
                        }}>
                        {items.map((ctrl, i) =>
                            <FormControlLabel 
                                label={ctrl.name}
                                control={ctrl.option}
                                labelPlacement="start"
                                // style={{
                                //     marginLeft: 0,
                                //     marginRight: 4,
                                // }}
                            />
                        )}
                        </FormGroup>

                        <Divider style={{
                            marginTop: 10,
                            marginBottom: 10,
                        }} />

                        <Grid item>
                            <Typography gutterBottom>
                                Iterations
                            </Typography>
                            <Slider 
                                min={0}
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
                        </Grid>
                    </Grid>
                    
                    {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>My account</MenuItem>
                    <MenuItem onClick={handleClose}>Logout</MenuItem> */}
                </Popover>
            </Backdrop>
        </div>
    );
}