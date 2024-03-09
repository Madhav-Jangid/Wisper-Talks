import { io } from 'socket.io-client';

const socket = io('http://localhost:6969');

export default socket;
