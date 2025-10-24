import json
import os
from typing import Dict, List, Optional
from datetime import datetime
from ..models.poll import Poll, PollOption


class DataManager:
    def __init__(self, data_file: str = "polls.json"):
        self.data_file = data_file
        self.polls: Dict[str, Poll] = {}
        self.load_data()

    def load_data(self):
        """Load polls from JSON file if it exists."""
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, 'r') as f:
                    data = json.load(f)
                    for poll_data in data.get('polls', []):
                        # Convert datetime string back to datetime object
                        poll_data['created_at'] = datetime.fromisoformat(poll_data['created_at'])
                        poll = Poll(**poll_data)
                        self.polls[poll.id] = poll
            except Exception as e:
                print(f"Error loading data: {e}")
                self.polls = {}

    def save_data(self):
        """Save polls to JSON file."""
        try:
            # Convert polls to dict format
            polls_data = []
            for poll in self.polls.values():
                poll_dict = poll.model_dump()
                # Convert datetime to string for JSON serialization
                poll_dict['created_at'] = poll.created_at.isoformat()
                polls_data.append(poll_dict)
            
            data = {'polls': polls_data}
            with open(self.data_file, 'w') as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"Error saving data: {e}")

    def create_poll(self, title: str, option_texts: List[str]) -> Poll:
        """Create a new poll."""
        options = [PollOption(text=text) for text in option_texts]
        poll = Poll(title=title, options=options)
        self.polls[poll.id] = poll
        self.save_data()
        return poll

    def get_poll(self, poll_id: str) -> Optional[Poll]:
        """Get a poll by ID."""
        return self.polls.get(poll_id)

    def get_all_polls(self) -> List[Poll]:
        """Get all polls."""
        return list(self.polls.values())

    def vote_on_poll(self, poll_id: str, user_id: str, option_id: str) -> Optional[Poll]:
        """Vote on a poll option."""
        poll = self.polls.get(poll_id)
        if not poll:
            return None

        # Find the option
        option_to_vote = None
        for option in poll.options:
            if option.id == option_id:
                option_to_vote = option
                break

        if not option_to_vote:
            return None

        # Check if user already voted
        if user_id in poll.voted_users:
            # Remove previous vote
            previous_option_id = poll.voted_users[user_id]
            for option in poll.options:
                if option.id == previous_option_id:
                    option.vote_count = max(0, option.vote_count - 1)
                    break

        # Add new vote
        option_to_vote.vote_count += 1
        poll.voted_users[user_id] = option_id

        self.save_data()
        return poll

    def like_poll(self, poll_id: str, user_id: str) -> Optional[Poll]:
        """Like a poll."""
        poll = self.polls.get(poll_id)
        if not poll:
            return None

        if user_id not in poll.liked_users:
            poll.liked_users.append(user_id)
            poll.like_count += 1
            self.save_data()

        return poll

    def unlike_poll(self, poll_id: str, user_id: str) -> Optional[Poll]:
        """Unlike a poll."""
        poll = self.polls.get(poll_id)
        if not poll:
            return None

        if user_id in poll.liked_users:
            poll.liked_users.remove(user_id)
            poll.like_count = max(0, poll.like_count - 1)
            self.save_data()

        return poll


# Global instance
data_manager = DataManager()
