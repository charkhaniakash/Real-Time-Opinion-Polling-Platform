from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime
import uuid


class PollOption(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    text: str
    vote_count: int = 0


class Poll(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    options: List[PollOption]
    like_count: int = 0
    created_at: datetime = Field(default_factory=datetime.now)
    voted_users: Dict[str, str] = Field(default_factory=dict)  # user_id -> option_id
    liked_users: List[str] = Field(default_factory=list)  # list of user_ids


class CreatePollRequest(BaseModel):
    title: str
    options: List[str]


class VoteRequest(BaseModel):
    user_id: str
    option_id: str


class LikeRequest(BaseModel):
    user_id: str


class PollResponse(BaseModel):
    id: str
    title: str
    options: List[PollOption]
    like_count: int
    created_at: datetime
    total_votes: int

    @classmethod
    def from_poll(cls, poll: Poll) -> "PollResponse":
        total_votes = sum(option.vote_count for option in poll.options)
        return cls(
            id=poll.id,
            title=poll.title,
            options=poll.options,
            like_count=poll.like_count,
            created_at=poll.created_at,
            total_votes=total_votes
        )


class WebSocketMessage(BaseModel):
    type: str  # "vote_update", "like_update"
    poll_id: str
    data: dict
