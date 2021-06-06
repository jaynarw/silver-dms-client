import { io } from 'socket.io-client';
import React from 'react';

class WSClient {
  constructor(url) {
    this.socket = io(url);
  }
}

export const SocketContext = React.createContext(null);

export default WSClient;
