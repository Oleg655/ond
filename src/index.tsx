import React from 'react';

import ReactDOM from 'react-dom';

import { App } from './App';
import './index.css';

// spy((event: SpyEvent) => {
//   if (event.type.includes('action')) {
//     console.log(event);
//   }
// });

ReactDOM.render(<App />, document.querySelector('#root'));
