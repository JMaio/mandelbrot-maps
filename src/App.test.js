import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// mock renderers since webgl methods are not implemented in test framework
jest.mock('./components/MandelbrotRenderer', () => () => <div />);
jest.mock('./components/JuliaRenderer', () => () => <div />);

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
