import { io, Socket } from 'socket.io-client';
import { Poll } from '@/store/poll';

// Function to determine the correct WebSocket URL based on environment
const getWebSocketURL = () => {
  if (process.env.NEXT_PUBLIC_WS_URL) {
    console.log("{{{{{{{{", process.env.NEXT_PUBLIC_WS_URL);
    return process.env.NEXT_PUBLIC_WS_URL;
  }
  
  // For production, use wss:// protocol
  if (process.env.NODE_ENV === 'production') {
    return 'wss://real-time-opinion-polling-platform.onrender.com/api/ws';
  }
  
  // For development, use ws:// protocol
  return 'ws://localhost:8000/api/ws';
};

const WEBSOCKET_URL = getWebSocketURL();

export interface WebSocketMessage {
  type: string;
  poll_id: string;
  data: Poll;
}

class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect(onMessage: (message: WebSocketMessage) => void) {
    try {
      this.socket = new WebSocket(WEBSOCKET_URL);

      this.socket.onopen = () => {
        console.log('WebSocket connected to:', WEBSOCKET_URL);
        this.reconnectAttempts = 0;
        
        // Send a heartbeat message to keep connection alive
        this.sendHeartbeat();
      };

      this.socket.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          onMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
        this.attemptReconnect(onMessage);
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
    }
  }

  private attemptReconnect(onMessage: (message: WebSocketMessage) => void) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        this.connect(onMessage);
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  private sendHeartbeat() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: 'ping' }));
      
      // Schedule next heartbeat
      setTimeout(() => {
        this.sendHeartbeat();
      }, 30000); // Send heartbeat every 30 seconds
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}

export const websocketService = new WebSocketService();