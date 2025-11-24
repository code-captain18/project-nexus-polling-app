import { Notification, Poll, User, Vote } from '../types';

// In-memory data store (replace with database in production)
export const users: User[] = [];
export const polls: Poll[] = [
    {
        id: '1',
        question: "What's your favorite programming language?",
        options: [
            { id: '1a', text: 'JavaScript', votes: 45 },
            { id: '1b', text: 'Python', votes: 32 },
            { id: '1c', text: 'TypeScript', votes: 28 },
            { id: '1d', text: 'Go', votes: 15 },
        ],
        totalVotes: 120,
        createdBy: 'system',
        createdAt: new Date('2024-11-01'),
    },
    {
        id: '2',
        question: 'Preferred mobile development framework?',
        options: [
            { id: '2a', text: 'React Native', votes: 68 },
            { id: '2b', text: 'Flutter', votes: 42 },
            { id: '2c', text: 'Native iOS/Android', votes: 30 },
        ],
        totalVotes: 140,
        createdBy: 'system',
        createdAt: new Date('2024-11-05'),
    },
];
export const votes: Vote[] = [];
export const notifications: Notification[] = [];
