import axios from 'axios';
import { Poll } from '@/store/poll';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface CreatePollRequest {
  title: string;
  options: string[];
}

export interface VoteRequest {
  user_id: string;
  option_id: string;
}

export interface LikeRequest {
  user_id: string;
}

export const pollAPI = {
  // Get all polls
  getPolls: async (): Promise<Poll[]> => {
    const response = await api.get('/polls');
    return response.data;
  },

  // Get a specific poll
  getPoll: async (pollId: string): Promise<Poll> => {
    const response = await api.get(`/polls/${pollId}`);
    return response.data;
  },

  // Create a new poll
  createPoll: async (request: CreatePollRequest): Promise<Poll> => {
    const response = await api.post('/polls', request);
    return response.data;
  },

  // Vote on a poll
  vote: async (pollId: string, request: VoteRequest): Promise<Poll> => {
    const response = await api.post(`/polls/${pollId}/vote`, request);
    return response.data;
  },

  // Like a poll
  like: async (pollId: string, request: LikeRequest): Promise<Poll> => {
    const response = await api.post(`/polls/${pollId}/like`, request);
    return response.data;
  },

  // Unlike a poll
  unlike: async (pollId: string, request: LikeRequest): Promise<Poll> => {
    const response = await api.post(`/polls/${pollId}/unlike`, request);
    return response.data;
  },
};

export default api;
