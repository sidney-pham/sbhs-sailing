import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './components/app';

ReactDOM.render((
  <Router>
    <App />
  </Router>
), document.getElementById('app'));
// Screw you React for not letting me target document.body 😡.
