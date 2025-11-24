import { API_ENDPOINTS } from '../config/api';
import type { ApiResponse } from './api';
import * as api from './api';

export interface Poll {
    id: string;
    question: string;
    options: PollOption[];
    totalVotes: number;
    createdBy: string;
    createdAt: string;
    expiresAt?: string;
}

export interface PollOption {
    id: string;
    text: string;
    votes: number;
}

export interface CreatePollData {
    question: string;
    options: string[];
    expiresAt?: string;
}

export interface VoteData {
    optionId: string;
}

export const pollService = {
    async getAllPolls(): Promise<ApiResponse<Poll[]>> {
        return api.get<Poll[]>(API_ENDPOINTS.POLLS.GET_ALL);
    },

    async getPollById(id: string): Promise<ApiResponse<Poll>> {
        return api.get<Poll>(API_ENDPOINTS.POLLS.GET_BY_ID(id));
    },

    async createPoll(data: CreatePollData): Promise<ApiResponse<Poll>> {
        return api.post<Poll>(API_ENDPOINTS.POLLS.CREATE, data);
    },

    async updatePoll(id: string, data: Partial<CreatePollData>): Promise<ApiResponse<Poll>> {
        return api.put<Poll>(API_ENDPOINTS.POLLS.UPDATE(id), data);
    },

    async deletePoll(id: string): Promise<ApiResponse> {
        return api.del(API_ENDPOINTS.POLLS.DELETE(id));
    },

    async vote(pollId: string, optionId: string): Promise<ApiResponse<Poll>> {
        return api.post<Poll>(
            API_ENDPOINTS.POLLS.VOTE(pollId),
            { optionId }
        );
    },
};
