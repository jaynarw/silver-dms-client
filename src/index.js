import React from 'react';
import ReactDOM from 'react-dom';
import '@fontsource/roboto';
import './index.css';
import HomePage from './components/Homepage';
import WSClient, { SocketContext } from './components/Socket';

const { socket } = new WSClient('http://localhost:5000');

ReactDOM.render(
  <React.StrictMode>
    <SocketContext.Provider value={socket}>
      <HomePage />
    </SocketContext.Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
