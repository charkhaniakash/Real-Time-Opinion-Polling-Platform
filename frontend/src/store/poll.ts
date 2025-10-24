import { create } from 'zustand';

export interface PollOption {
  id: string;
  text: string;
  vote_count: number;
}

export interface Poll {
  id: string;
  title: string;
  options: PollOption[];
  like_count: number;
  created_at: string;
  total_votes: number;
}

interface PollState {
  polls: Poll[];
  currentPoll: Poll | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  setPolls: (polls: Poll[]) => void;
  addPoll: (poll: Poll) => void;
  updatePoll: (poll: Poll) => void;
  setCurrentPoll: (poll: Poll | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePollStore = create<PollState>((set, get) => ({
  polls: [],
  currentPoll: null,
  loading: false,
  error: null,

  setPolls: (polls) => set({ polls }),
  
  addPoll: (poll) => set((state) => ({
    polls: [poll, ...state.polls]
  })),
  
  updatePoll: (updatedPoll) => set((state) => ({
    polls: state.polls.map((poll) =>
      poll.id === updatedPoll.id ? updatedPoll : poll
    ),
    currentPoll: state.currentPoll?.id === updatedPoll.id ? updatedPoll : state.currentPoll
  })),
  
  setCurrentPoll: (poll) => set({ currentPoll: poll }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error })
}));
