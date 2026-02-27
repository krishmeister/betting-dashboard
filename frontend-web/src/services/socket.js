import { io } from 'socket.io-client';

// Hardcoded target to backend-node-realtime server
const SOCKET_URL = 'http://localhost:3001';

export const socket = io(SOCKET_URL, {
    autoConnect: true,
    transports: ['websocket', 'polling']
});

socket.on('connect', () => {
    console.log('[Socket] Connect Hook Attached:', socket.id);
});

socket.on('disconnect', () => {
    console.log('[Socket] Disconnect Hook Called');
});
