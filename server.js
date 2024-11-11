// server.js
import http from 'http';
import app from './app.js';
import { setupWebSocket } from './utils/websocket.js';

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

// Initialize WebSocket server
setupWebSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
