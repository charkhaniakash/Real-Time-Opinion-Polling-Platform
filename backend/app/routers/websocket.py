from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from ..services.websocket import manager

router = APIRouter()


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """Global WebSocket endpoint for real-time updates."""
    await manager.connect(websocket)
    
    try:
        while True:
            # Keep the connection alive
            data = await websocket.receive_text()
            # Echo back any received messages (can be used for heartbeat)
            await manager.send_personal_message(f"Echo: {data}", websocket)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)


@router.websocket("/ws/{poll_id}")
async def websocket_poll_endpoint(websocket: WebSocket, poll_id: str):
    """Poll-specific WebSocket endpoint for real-time updates."""
    await manager.connect(websocket, poll_id)
    
    try:
        while True:
            # Keep the connection alive and listen for any messages
            data = await websocket.receive_text()
            # Echo back any received messages
            await manager.send_personal_message(f"Connected to poll {poll_id}: {data}", websocket)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, poll_id)
