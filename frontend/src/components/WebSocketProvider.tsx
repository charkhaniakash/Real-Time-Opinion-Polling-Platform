'use client';

import { useEffect, createContext, useContext } from 'react';
import { websocketService, WebSocketMessage } from '@/services/websocket';
import { usePollStore } from '@/store/poll';
import { toast } from 'sonner';

const WebSocketContext = createContext(null);

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export default function WebSocketProvider({ children }: WebSocketProviderProps) {
  const { updatePoll, addPoll } = usePollStore();

  useEffect(() => {
    const handleWebSocketMessage = (message: WebSocketMessage) => {
      console.log('WebSocket message received:', message);
      
      switch (message.type) {
        case 'poll_created':
          addPoll(message.data);
          toast.success('New poll created!');
          break;
        
        case 'vote_update':
          updatePoll(message.data);
          break;
        
        case 'like_update':
          updatePoll(message.data);
          break;
        
        default:
          console.log('Unknown message type:', message.type);
      }
    };

    // Connect to WebSocket
    websocketService.connect(handleWebSocketMessage);

    // Cleanup on unmount
    return () => {
      websocketService.disconnect();
    };
  }, [updatePoll, addPoll]);

  return (
    <WebSocketContext.Provider value={null}>
      {children}
    </WebSocketContext.Provider>
  );
}

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  return context;
};
