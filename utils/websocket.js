// utils/websocket.js
import { WebSocketServer } from 'ws';
import processManager from '../services/processManager.js';

let wss;

export const setupWebSocket = (server) => {
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('WebSocket connection established');

    // Store intervals per client connection
    const intervals = new Map();

    ws.on('message', (message) => {
      const { action, processId } = JSON.parse(message);

      if (action === 'checkStatus' && processId) {
        // If there's already an interval for this processId, clear it first
        if (intervals.has(processId)) {
          clearInterval(intervals.get(processId));
        }

        // Start a new interval for polling process status
        const checkInterval = setInterval(() => {
          const status = processManager.getProcessStatus(processId);
          if (status.status === 'completed' || status.status === 'failed') {
            ws.send(JSON.stringify({ processId, status })); // Send status update
            clearInterval(checkInterval); // Clear interval once done
            intervals.delete(processId);  // Remove from intervals map
          }
        }, 1000); // Check every 1 second

        // Store the interval in the map
        intervals.set(processId, checkInterval);
      }
    });

    // Clean up intervals when the client disconnects
    ws.on('close', () => {
      console.log('WebSocket connection closed');
      intervals.forEach((interval) => clearInterval(interval)); // Clear all intervals
      intervals.clear(); // Clear the map to free memory
    });
  });
};


