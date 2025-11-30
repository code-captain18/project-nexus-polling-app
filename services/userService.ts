import { API_ENDPOINTS } from '../config/api';
import type { ApiResponse } from './api';
import * as api from './api';
import { Poll } from './pollService';

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    pollsCreated?: number;
    votesCast?: number;
}

export interface UpdateProfileData {
    name?: string;
    email?: string;
    password?: string;
}

export const userService = {
    async getProfile(): Promise<ApiResponse<UserProfile>> {
        return api.get<UserProfile>(API_ENDPOINTS.USERS.GET_PROFILE);
    },

    async updateProfile(data: UpdateProfileData): Promise<ApiResponse<UserProfile>> {
        return api.put<UserProfile>(API_ENDPOINTS.USERS.UPDATE_PROFILE, data);
    },

    async getMyPolls(): Promise<ApiResponse<Poll[]>> {
        return api.get<Poll[]>(API_ENDPOINTS.USERS.GET_MY_POLLS);
    },

    async getMyVotes(): Promise<ApiResponse<Poll[]>> {
        return api.get<Poll[]>(API_ENDPOINTS.USERS.GET_MY_VOTES);
    },
};
