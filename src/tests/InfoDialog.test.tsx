import { useState } from 'react';
import ReactDOM from 'react-dom';

import InfoDialog from '../components/info/InfoDialog';

it('Info Dialog: renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<InfoDialog ctrl={[true, () => {}]} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
