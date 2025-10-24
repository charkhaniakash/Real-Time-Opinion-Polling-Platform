from fastapi import APIRouter, HTTPException
from typing import List
from ..models.poll import CreatePollRequest, VoteRequest, LikeRequest, PollResponse
from ..data.manager import data_manager
from ..services.websocket import manager

router = APIRouter()


@router.post("/polls", response_model=PollResponse)
async def create_poll(request: CreatePollRequest):
    """Create a new poll."""
    if len(request.options) < 2:
        raise HTTPException(status_code=400, detail="Poll must have at least 2 options")
    
    if len(request.options) > 10:
        raise HTTPException(status_code=400, detail="Poll cannot have more than 10 options")
    
    poll = data_manager.create_poll(request.title, request.options)
    poll_response = PollResponse.from_poll(poll)
    
    # Broadcast new poll creation to all connected clients
    await manager.broadcast_poll_update(poll_response, "poll_created")
    
    return poll_response


@router.get("/polls", response_model=List[PollResponse])
async def get_all_polls():
    """Get all polls."""
    polls = data_manager.get_all_polls()
    return [PollResponse.from_poll(poll) for poll in polls]


@router.get("/polls/{poll_id}", response_model=PollResponse)
async def get_poll(poll_id: str):
    """Get a specific poll by ID."""
    poll = data_manager.get_poll(poll_id)
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")
    
    return PollResponse.from_poll(poll)


@router.post("/polls/{poll_id}/vote", response_model=PollResponse)
async def vote_on_poll(poll_id: str, request: VoteRequest):
    """Vote on a poll option."""
    poll = data_manager.vote_on_poll(poll_id, request.user_id, request.option_id)
    if not poll:
        raise HTTPException(status_code=404, detail="Poll or option not found")
    
    poll_response = PollResponse.from_poll(poll)
    
    # Broadcast vote update to all connected clients
    await manager.broadcast_poll_update(poll_response, "vote_update")
    
    return poll_response


@router.post("/polls/{poll_id}/like", response_model=PollResponse)
async def like_poll(poll_id: str, request: LikeRequest):
    """Like a poll."""
    poll = data_manager.like_poll(poll_id, request.user_id)
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")
    
    poll_response = PollResponse.from_poll(poll)
    
    # Broadcast like update to all connected clients
    await manager.broadcast_poll_update(poll_response, "like_update")
    
    return poll_response


@router.post("/polls/{poll_id}/unlike", response_model=PollResponse)
async def unlike_poll(poll_id: str, request: LikeRequest):
    """Unlike a poll."""
    poll = data_manager.unlike_poll(poll_id, request.user_id)
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")
    
    poll_response = PollResponse.from_poll(poll)
    
    # Broadcast unlike update to all connected clients
    await manager.broadcast_poll_update(poll_response, "like_update")
    
    return poll_response
