import React from 'react';
import { Fab } from '@material-ui/core';

export default function TransparentFab(props) {
  const { children, ...p } = props;
  return (
    <Fab
      style={{
        backgroundColor: 'transparent',
        boxShadow: 'none',
      }}
      {...p}
    >
      {children}
    </Fab>
  );
}
