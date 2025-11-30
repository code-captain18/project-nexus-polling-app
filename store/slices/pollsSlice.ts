import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    createPollAsync,
    deletePollAsync,
    fetchPollByIdAsync,
    fetchPollsAsync,
    updatePollAsync,
    votePollAsync
} from '../thunks/pollThunks';

export interface PollOption {
    id: string;
    text: string;
    votes: number;
}

export interface Poll {
    id: string;
    question: string;
    options: PollOption[];
    totalVotes: number;
    createdBy?: string;
    createdAt?: string;
    startDate?: string;
    endDate?: string;
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
    polls: [],
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
            if (poll && poll.options[action.payload.optionIndex]) {
                poll.options[action.payload.optionIndex].votes++;
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
    extraReducers: (builder) => {
        // Fetch Polls
        builder
            .addCase(fetchPollsAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPollsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.polls = action.payload;
            })
            .addCase(fetchPollsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Fetch Poll by ID
        builder
            .addCase(fetchPollByIdAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPollByIdAsync.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.polls.findIndex(p => p.id === action.payload.id);
                if (index >= 0) {
                    state.polls[index] = action.payload;
                } else {
                    state.polls.push(action.payload);
                }
            })
            .addCase(fetchPollByIdAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Create Poll
        builder
            .addCase(createPollAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPollAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.polls.unshift(action.payload);
            })
            .addCase(createPollAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Vote Poll
        builder
            .addCase(votePollAsync.pending, (state, action) => {
                // Optimistic update - update UI immediately before API responds
                const { pollId, optionId } = action.meta.arg;
                const poll = state.polls.find(p => p.id === pollId);
                if (poll) {
                    const option = poll.options.find(opt => opt.id === optionId);
                    if (option) {
                        option.votes++;
                        poll.totalVotes++;
                    }

                    // Record user's vote optimistically
                    const optionIndex = poll.options.findIndex(opt => opt.id === optionId);
                    if (optionIndex >= 0) {
                        const existingVoteIndex = state.userVotes.findIndex(v => v.pollId === pollId);
                        if (existingVoteIndex >= 0) {
                            state.userVotes[existingVoteIndex].optionIndex = optionIndex;
                        } else {
                            state.userVotes.push({
                                pollId,
                                optionIndex,
                            });
                        }
                    }
                }
                state.loading = true;
                state.error = null;
            })
            .addCase(votePollAsync.fulfilled, (state, action) => {
                state.loading = false;
                // Update with server response to ensure consistency
                const index = state.polls.findIndex(p => p.id === action.payload.id);
                if (index >= 0) {
                    state.polls[index] = action.payload;
                }
            })
            .addCase(votePollAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                // Rollback optimistic update on error
                const { pollId, optionId } = action.meta.arg;
                const poll = state.polls.find(p => p.id === pollId);
                if (poll) {
                    const option = poll.options.find(opt => opt.id === optionId);
                    if (option && option.votes > 0) {
                        option.votes--;
                        poll.totalVotes--;
                    }
                    // Remove user vote
                    state.userVotes = state.userVotes.filter(v => v.pollId !== pollId);
                }
            });

        // Delete Poll
        builder
            .addCase(deletePollAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePollAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.polls = state.polls.filter(p => p.id !== action.meta.arg);
                state.userVotes = state.userVotes.filter(v => v.pollId !== action.meta.arg);
            })
            .addCase(deletePollAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Update Poll
        builder
            .addCase(updatePollAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePollAsync.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.polls.findIndex(p => p.id === action.payload.id);
                if (index >= 0) {
                    state.polls[index] = action.payload;
                }
            })
            .addCase(updatePollAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setPolls, addPoll, votePoll, deletePoll, setLoading, setError } = pollsSlice.actions;
export default pollsSlice.reducer;
