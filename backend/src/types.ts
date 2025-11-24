export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
}

export interface Poll {
    id: string;
    question: string;
    options: PollOption[];
    totalVotes: number;
    createdBy: string;
    createdAt: Date;
    expiresAt?: Date;
}

export interface PollOption {
    id: string;
    text: string;
    votes: number;
}

export interface Vote {
    id: string;
    pollId: string;
    userId: string;
    optionId: string;
    createdAt: Date;
}

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: 'vote' | 'comment' | 'poll_created' | 'other';
    read: boolean;
    createdAt: Date;
    data?: any;
}

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}
