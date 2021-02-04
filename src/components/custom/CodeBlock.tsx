import { makeStyles } from '@material-ui/core';
import React, { ReactNode } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey[300],
    padding: '8px 12px',
    borderRadius: theme.shape.borderRadius,
  },
}));

export const CodeBlock = ({ children }: { children?: ReactNode }): JSX.Element => {
  const classes = useStyles();

  return (
    <pre className={classes.root}>
      <code>{children}</code>
    </pre>
  );
};
