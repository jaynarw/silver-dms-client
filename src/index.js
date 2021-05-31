import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Box from './admin.js'
import App from './App.js'
import HomePage from './updComponents/home/adminHome.js';




ReactDOM.render(
  <React.StrictMode>
    <HomePage />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

