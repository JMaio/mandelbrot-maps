import { Dialog, Fade, IconButton, MobileStepper } from '@material-ui/core';
import { HelpOutline, KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import React, { useEffect, useRef, useState } from 'react';
import { mod } from 'react-swipeable-views-core';
import { FirstTimeInfoProps } from '../../common/settings';
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
export default function FirstTimeInfo({
  ctrl: [open, setOpen],
}: FirstTimeInfoProps): JSX.Element {
  // const classes = useStyles();
  const returningUserKey = 'returningUser';

  // const isFirstVisit = (): boolean => {
  //   return true;
  // };
  // assume this is a new user
  // const [open, setOpen] = ctrl;

  // https://programmingwithmosh.com/react/localstorage-react/
  useEffect(() => {
    const returningUser = localStorage.getItem(returningUserKey);
    console.info(`Returning user? => ${returningUser}`);
    if (!returningUser) {
      // setOpen(true);
      // then they are no longer a new user
      // localStorage.setItem(returningUserKey)
    }
  }, [setOpen]);

  const handleClose = () => setOpen(false);

  const helptextEntries = Object.entries(helptext);

  // https://material-ui.com/components/steppers/#dots
  const steps = helptextEntries.length;
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prev) => mod(prev + 1, steps));
  };

  const handleBack = () => {
    setActiveStep((prev) => mod(prev - 1, steps));
  };

  const contentRef = useRef<HTMLElement>();
  // scroll to top of Markdown if page changes
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [activeStep]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle onClose={handleClose}>
        <HelpOutline style={{ marginRight: 8 }} />
        Help
      </DialogTitle>
      <DialogContent dividers ref={contentRef}>
        {helptextEntries.map(([name, md], i) => (
          <Fade
            in={i === activeStep}
            // hide this element if it's not being show,
            // otherwise it will take up vertical space
            style={i === activeStep ? {} : { display: 'none' }}
            key={name}
          >
            <div>
              <MarkdownFromFile f={md} />
            </div>
          </Fade>
        ))}

        {/* <SwipeableViews
          // don't enable mouse events: a user may want to copy text
          // enableMouseEvents
          resistance
          animateHeight
          hysteresis={0.2}
          index={activeStep}
          onChangeIndex={handleStepChange}
          style={{
            // explicitly make all the available area swipeable:
            // makes it possible to swipe on empty areas without content
            minHeight: '100%',
          }}
          // the library doesn't appear to support functional components
          // and hooks well (useRef also bugged)... this is only a partial
          // solution for now
          // slideRenderer={slideRenderer}
        >
          {helptextEntries.map(([name, md], k) => (
            <div key={k}>
              <MarkdownFromFile f={md} />
            </div>
          ))}
        </SwipeableViews> */}
      </DialogContent>

      <DialogActions style={{ padding: 2 }}>
        <MobileStepper
          variant="dots"
          steps={steps}
          position="static"
          activeStep={activeStep}
          style={{
            backgroundColor: 'inherit',
            flexGrow: 1,
            // width: '100%',
            maxWidth: 240,
            margin: 'auto',
            padding: 0,
          }}
          nextButton={
            // <Button variant="text" onClick={handleNext} endIcon={<KeyboardArrowRight />}>
            //   Next
            // </Button>
            <IconButton color="primary" onClick={handleNext}>
              <KeyboardArrowRight />
            </IconButton>
          }
          backButton={
            // <Button variant="text" onClick={handleBack} startIcon={<KeyboardArrowLeft />}>
            //   Back
            // </Button>
            <IconButton color="primary" onClick={handleBack}>
              <KeyboardArrowLeft />
            </IconButton>
          }
        />
      </DialogActions>
    </Dialog>
  );
}
