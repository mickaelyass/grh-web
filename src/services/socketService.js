// services/socketService.js

import { io } from 'socket.io-client';

// URL de base de l'API (axios) : elle se termine par "/api".
const API_URL = import.meta.env.VITE_API_BASE_URL;

// Cote serveur (grh-api, utils/socket.js), Socket.IO n'expose QUE le
// namespace par defaut "/" : passer l'URL complete ".../api" ferait
// connecter le client sur le namespace "/api" -> "Invalid namespace" et
// les notifications n'arriveraient jamais. On ne retient donc que
// l'origine (schema + hote + port) de l'API.
// - production : https://app-backend-011q.onrender.com/api -> https://app-backend-011q.onrender.com
// - developpement : "/api" -> origine courante (le proxy Vite relaie /socket.io)
const SOCKET_URL = API_URL
  ? new URL(API_URL, window.location.origin).origin
  : undefined;

const socket = io(SOCKET_URL);

export default socket;
