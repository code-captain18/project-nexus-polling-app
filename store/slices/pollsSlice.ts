import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Poll {
    id: string;
    question: string;
    options: string[];
    votes: number[];
    totalVotes: number;
    createdBy?: string;
    createdAt?: string;
}

interface UserVote {
    pollId: string;
    optionIndex: number;
}

interface PollsState {
    polls: Poll[];
    userVotes: UserVote[];
    loading: boolean;
    error: string | null;
}

const initialState: PollsState = {
    polls: [
        {
            id: "1",
            question: "What's your favorite programming language?",
            options: ["JavaScript", "Python", "TypeScript", "Go"],
            votes: [45, 32, 28, 15],
            totalVotes: 120,
        },
        {
            id: "2",
            question: "Preferred mobile development framework?",
            options: ["React Native", "Flutter", "Native iOS/Android"],
            votes: [68, 42, 30],
            totalVotes: 140,
        },
    ],
    userVotes: [],
    loading: false,
    error: null,
};

const pollsSlice = createSlice({
    name: 'polls',
    initialState,
    reducers: {
        setPolls: (state, action: PayloadAction<Poll[]>) => {
            state.polls = action.payload;
            state.loading = false;
            state.error = null;
        },
        addPoll: (state, action: PayloadAction<Poll>) => {
            state.polls.unshift(action.payload);
        },
        votePoll: (state, action: PayloadAction<{ pollId: string; optionIndex: number }>) => {
            const poll = state.polls.find(p => p.id === action.payload.pollId);
            if (poll) {
                poll.votes[action.payload.optionIndex]++;
                poll.totalVotes++;

                // Record user's vote
                const existingVoteIndex = state.userVotes.findIndex(v => v.pollId === action.payload.pollId);
                if (existingVoteIndex >= 0) {
                    state.userVotes[existingVoteIndex].optionIndex = action.payload.optionIndex;
                } else {
                    state.userVotes.push({
                        pollId: action.payload.pollId,
                        optionIndex: action.payload.optionIndex,
                    });
                }
            }
        },
        deletePoll: (state, action: PayloadAction<string>) => {
            state.polls = state.polls.filter(p => p.id !== action.payload);
            state.userVotes = state.userVotes.filter(v => v.pollId !== action.payload);
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const { setPolls, addPoll, votePoll, deletePoll, setLoading, setError } = pollsSlice.actions;
export default pollsSlice.reducer;
