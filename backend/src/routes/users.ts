import { Request, Response, Router } from 'express';
import { polls, users, votes } from '../data/store';
import { authenticate } from '../middleware/auth';

const router = Router();

interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}

// Get User Profile
router.get('/profile', authenticate, (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const user = users.find((u) => u.id === authReq.user?.id);

    if (!user) {
        res.status(404).json({
            success: false,
            error: 'User not found',
        });
        return;
    }

    const userPolls = polls.filter((p) => p.createdBy === user.id);
    const userVotes = votes.filter((v) => v.userId === user.id);

    res.json({
        success: true,
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            pollsCreated: userPolls.length,
            votesCast: userVotes.length,
        },
    });
});

// Update User Profile
router.put('/profile', authenticate, async (req: Request, res: Response) => {
    try {
        const authReq = req as AuthRequest;
        const user = users.find((u) => u.id === authReq.user?.id);

        if (!user) {
            res.status(404).json({
                success: false,
                error: 'User not found',
            });
            return;
        }

        const { name, email } = req.body;

        if (name) user.name = name;
        if (email) {
            // Check if email is already taken
            const emailExists = users.find(
                (u) => u.email === email && u.id !== user.id
            );
            if (emailExists) {
                res.status(400).json({
                    success: false,
                    error: 'Email already in use',
                });
                return;
            }
            user.email = email;
        }

        res.json({
            success: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update profile',
        });
    }
});

// Get User's Polls
router.get('/polls', authenticate, (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const userPolls = polls.filter((p) => p.createdBy === authReq.user?.id);

    res.json({
        success: true,
        data: userPolls,
    });
});

// Get User's Votes
router.get('/votes', authenticate, (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const userVotes = votes.filter((v) => v.userId === authReq.user?.id);

    const votedPolls = userVotes.map((vote) => {
        const poll = polls.find((p) => p.id === vote.pollId);
        return poll;
    }).filter(Boolean);

    res.json({
        success: true,
        data: votedPolls,
    });
});

export default router;
