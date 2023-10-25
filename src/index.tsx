import React, { StrictMode } from 'react';

import ReactDOM from 'react-dom';

import { App } from './App';
import './index.css';

// spy((event: SpyEvent) => {
//   if (event.type.includes('action')) {
//     console.log(event);
//   }
// });

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.querySelector('#root'),
);
