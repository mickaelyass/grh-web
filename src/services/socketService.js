// services/socketService.js

import { io } from 'socket.io-client';

const socket = io('http://localhost:3003'); // Remplacez par l'URL de votre serveur Node.js où Socket.io est configuré

export default socket;
