import { Button, Dialog, MobileStepper } from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { DialogActions, DialogContent, DialogTitle } from '../custom/DialogComponents';
import helptext from './helptext/helptext';
import { MarkdownFromFile } from './MarkdownOverrides';

// const useStyles = makeStyles((theme) => ({
//   // root: {
//   //   transform: 'translateX(-50%) translateY(-50%)',
//   // },
//   changeViewButton: {
//     padding: 4,
//   },
// }));

/**
 * A component shown to users when they first visit the application.
 * Uses Local Storage to track repeat visits.
 */
export default function FirstTimeInfo(): JSX.Element {
  // const classes = useStyles();
  const returningUserKey = 'returningUser';

  // const isFirstVisit = (): boolean => {
  //   return true;
  // };
  // assume this is a new user
  const [open, setOpen] = useState(false);

  // https://programmingwithmosh.com/react/localstorage-react/
  useEffect(() => {
    const returningUser = localStorage.getItem(returningUserKey);
    console.info(`Returning user? => ${returningUser}`);
    if (!returningUser) {
      setOpen(true);
      // then they are no longer a new user
      // localStorage.setItem(returningUserKey)
    }
  }, []);

  const handleClose = () => setOpen(false);

  // https://material-ui.com/components/steppers/#dots
  const steps = 5;
  const [activeStep, setActiveStep] = useState(0);

  const wrapStep = (next: number) => (next + steps) % steps;

  const handleNext = () => {
    setActiveStep((prev) => wrapStep(prev + 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => wrapStep(prev - 1));
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  const helptextEntries = Object.entries(helptext);

  // const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews);
  // const VirtualizeSwipeableViews = virtualize(SwipeableViews);

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      maxWidth="md"
      PaperProps={{
        style: {
          // fill more of the screen with this dialog
          margin: 16,
          height: 960,
          maxHeight: 'calc(100% - 32px)',
        },
      }}
    >
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        Help
      </DialogTitle>
      <DialogContent
        dividers
        style={{
          maxWidth: 700,
          // height: '100%',
          // display: 'flex',
          // flexDirection: 'column',
        }}
      >
        <SwipeableViews
          enableMouseEvents
          resistance
          animateHeight
          hysteresis={0.2}
          index={activeStep}
          onChangeIndex={handleStepChange}
          style={{
            // makes it possible to swipe on empty areas
            minHeight: '100%',
          }}
        >
          {helptextEntries.map(([name, md], k) => (
            <div key={k}>
              <MarkdownFromFile f={md} />
            </div>
          ))}
        </SwipeableViews>

        {/* <Stepper activeStep={activeStep} alternativeLabel>
          <Step>
            <StepLabel>hi</StepLabel>
          </Step>
          <Step>
            <StepLabel>hello</StepLabel>
          </Step>
          <Step>
            <StepLabel>there</StepLabel>
          </Step>
        </Stepper> */}
      </DialogContent>

      <DialogActions>
        <MobileStepper
          variant="dots"
          steps={steps}
          position="static"
          activeStep={activeStep}
          style={{
            flexGrow: 1,
            backgroundColor: 'inherit',
          }}
          nextButton={
            <Button
              // size="small"
              variant="text"
              onClick={handleNext}
              // disabled={activeStep === steps - 1}
              endIcon={<KeyboardArrowRight />}
            >
              Next
            </Button>
          }
          backButton={
            <Button
              // size="small"
              variant="text"
              onClick={handleBack}
              // disabled={activeStep === 0}
              startIcon={<KeyboardArrowLeft />}
            >
              Back
            </Button>
          }
        />
        {/* <Button
          onClick={() => {
            writeClientDataToClipboard();
          }}
          color="primary"
          variant="outlined"
          startIcon={<FileCopyIcon />}
        >
          Copy info
        </Button>
        <Snackbar
          open={snackBarOpen}
          autoHideDuration={5000}
          // clicking outside the snackbar would trigger close
          onClose={(e, reason) => {
            switch (reason) {
              case 'clickaway':
                // don't close the snackbar on clicking outside
                break;
              default:
                setSnackBarOpen(false);
            }
          }}
        >
          <Alert onClose={() => setSnackBarOpen(false)} severity="info">
            Device properties copied!
          </Alert>
        </Snackbar>
        <Button
          color="primary"
          variant="outlined"
          startIcon={<LaunchIcon />}
          href={survey.link}
          target="_blank"
          rel="noopener"
        >
          Feedback
        </Button> */}
      </DialogActions>
    </Dialog>
  );
}
