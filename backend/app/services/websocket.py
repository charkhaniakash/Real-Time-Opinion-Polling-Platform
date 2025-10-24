import json
from typing import List, Dict
from fastapi import WebSocket
from ..models.poll import WebSocketMessage, PollResponse


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.poll_connections: Dict[str, List[WebSocket]] = {}  # poll_id -> list of connections

    async def connect(self, websocket: WebSocket, poll_id: str = None):
        """Accept a new WebSocket connection."""
        await websocket.accept()
        self.active_connections.append(websocket)
        
        if poll_id:
            if poll_id not in self.poll_connections:
                self.poll_connections[poll_id] = []
            self.poll_connections[poll_id].append(websocket)

    def disconnect(self, websocket: WebSocket, poll_id: str = None):
        """Remove a WebSocket connection."""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        
        if poll_id and poll_id in self.poll_connections:
            if websocket in self.poll_connections[poll_id]:
                self.poll_connections[poll_id].remove(websocket)
            
            # Clean up empty poll connections
            if not self.poll_connections[poll_id]:
                del self.poll_connections[poll_id]

    async def send_personal_message(self, message: str, websocket: WebSocket):
        """Send a message to a specific WebSocket connection."""
        try:
            await websocket.send_text(message)
        except Exception as e:
            print(f"Error sending personal message: {e}")
            self.disconnect(websocket)

    async def broadcast(self, message: WebSocketMessage):
        """Broadcast a message to all active connections."""
        message_text = json.dumps(message.model_dump(mode='json'))
        
        # Remove disconnected connections
        connections_to_remove = []
        
        for connection in self.active_connections:
            try:
                await connection.send_text(message_text)
            except Exception as e:
                print(f"Error broadcasting message: {e}")
                connections_to_remove.append(connection)
        
        # Clean up disconnected connections
        for connection in connections_to_remove:
            self.disconnect(connection)

    async def broadcast_to_poll(self, poll_id: str, message: WebSocketMessage):
        """Broadcast a message to connections subscribed to a specific poll."""
        if poll_id not in self.poll_connections:
            return
        
        message_text = json.dumps(message.model_dump(mode='json'))
        connections_to_remove = []
        
        for connection in self.poll_connections[poll_id]:
            try:
                await connection.send_text(message_text)
            except Exception as e:
                print(f"Error broadcasting to poll {poll_id}: {e}")
                connections_to_remove.append(connection)
        
        # Clean up disconnected connections
        for connection in connections_to_remove:
            self.disconnect(connection, poll_id)

    async def broadcast_poll_update(self, poll_response: PollResponse, update_type: str = "poll_update"):
        """Broadcast poll updates to all connections."""
        message = WebSocketMessage(
            type=update_type,
            poll_id=poll_response.id,
            data=poll_response.model_dump()
        )
        await self.broadcast(message)


# Global WebSocket manager
manager = ConnectionManager()
