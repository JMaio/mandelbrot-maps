import React from 'react';
import { Fab } from '@material-ui/core';

export default class TransparentButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Fab style={{
        backgroundColor: "transparent",
        boxShadow: "none",
      }}>
        {this.props.children}
      </Fab>
    )
  }
}