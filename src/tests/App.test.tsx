import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import App from '../App';

// mock renderers since webgl methods are not implemented in test framework
jest.mock('../components/render/MandelbrotRenderer', () => () => <div />);
jest.mock('../components/render/JuliaRenderer', () => () => <div />);

it('App: renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
