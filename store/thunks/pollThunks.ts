import { createAsyncThunk } from '@reduxjs/toolkit';
import { CreatePollData, pollService } from '../../services/pollService';

// Fetch All Polls
export const fetchPollsAsync = createAsyncThunk(
    'polls/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await pollService.getAllPolls();

            if (!response.success) {
                return rejectWithValue(response.error || 'Failed to fetch polls');
            }

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'An error occurred');
        }
    }
);

// Fetch Single Poll
export const fetchPollByIdAsync = createAsyncThunk(
    'polls/fetchById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await pollService.getPollById(id);

            if (!response.success) {
                return rejectWithValue(response.error || 'Failed to fetch poll');
            }

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'An error occurred');
        }
    }
);

// Create Poll
export const createPollAsync = createAsyncThunk(
    'polls/create',
    async (data: CreatePollData, { rejectWithValue }) => {
        try {
            const response = await pollService.createPoll(data);

            if (!response.success) {
                return rejectWithValue(response.error || 'Failed to create poll');
            }

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'An error occurred');
        }
    }
);

// Vote on Poll
export const votePollAsync = createAsyncThunk(
    'polls/vote',
    async ({ pollId, optionId }: { pollId: string; optionId: string }, { rejectWithValue }) => {
        try {
            const response = await pollService.vote(pollId, optionId);

            if (!response.success) {
                return rejectWithValue(response.error || 'Failed to vote');
            }

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'An error occurred');
        }
    }
);

// Delete Poll
export const deletePollAsync = createAsyncThunk(
    'polls/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await pollService.deletePoll(id);

            if (!response.success) {
                return rejectWithValue(response.error || 'Failed to delete poll');
            }

            return id;
        } catch (error: any) {
            return rejectWithValue(error.message || 'An error occurred');
        }
    }
);
