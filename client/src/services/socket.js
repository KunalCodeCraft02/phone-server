import { io } from 'socket.io-client';
import { API_BASE_URL } from '../utils/constants';

let socket = null;

export function getSocket() {
  return socket;
}

export function connectSocket(token) {
  if (socket?.connected) return socket;

  socket = io(API_BASE_URL.replace('/api', ''), {
    auth: { token },
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function onSocketEvent(event, callback) {
  if (socket) {
    socket.on(event, callback);
  }
}

export function offSocketEvent(event, callback) {
  if (socket) {
    socket.off(event, callback);
  }
}

export function emitSocketEvent(event, data) {
  if (socket?.connected) {
    socket.emit(event, data);
  }
}
