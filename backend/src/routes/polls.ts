import { Request, Response, Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { notifications, polls, votes } from '../data/store';
import { authenticate } from '../middleware/auth';

const router = Router();

interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}

// Get All Polls
router.get('/', (req: Request, res: Response) => {
    res.json({
        success: true,
        data: polls,
    });
});

// Get Poll by ID
router.get('/:id', (req: Request, res: Response) => {
    const poll = polls.find((p) => p.id === req.params.id);

    if (!poll) {
        res.status(404).json({
            success: false,
            error: 'Poll not found',
        });
        return;
    }

    res.json({
        success: true,
        data: poll,
    });
});

// Create Poll
router.post('/', authenticate, (req: Request, res: Response) => {
    try {
        const authReq = req as AuthRequest;
        const { question, options, expiresAt } = req.body;

        if (!question || !options || !Array.isArray(options) || options.length < 2) {
            res.status(400).json({
                success: false,
                error: 'Question and at least 2 options are required',
            });
            return;
        }

        const poll = {
            id: uuidv4(),
            question,
            options: options.map((text: string) => ({
                id: uuidv4(),
                text,
                votes: 0,
            })),
            totalVotes: 0,
            createdBy: authReq.user?.id || 'unknown',
            createdAt: new Date(),
            expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        };

        polls.push(poll);

        res.status(201).json({
            success: true,
            data: poll,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to create poll',
        });
    }
});

// Update Poll
router.put('/:id', authenticate, (req: Request, res: Response) => {
    try {
        const authReq = req as AuthRequest;
        const pollIndex = polls.findIndex((p) => p.id === req.params.id);

        if (pollIndex === -1) {
            res.status(404).json({
                success: false,
                error: 'Poll not found',
            });
            return;
        }

        const poll = polls[pollIndex];

        if (poll.createdBy !== authReq.user?.id) {
            res.status(403).json({
                success: false,
                error: 'Not authorized to update this poll',
            });
            return;
        }

        const { question, options } = req.body;

        if (question) poll.question = question;
        if (options && Array.isArray(options)) {
            poll.options = options.map((text: string) => ({
                id: uuidv4(),
                text,
                votes: 0,
            }));
            poll.totalVotes = 0;
        }

        res.json({
            success: true,
            data: poll,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update poll',
        });
    }
});

// Delete Poll
router.delete('/:id', authenticate, (req: Request, res: Response) => {
    try {
        const authReq = req as AuthRequest;
        const pollIndex = polls.findIndex((p) => p.id === req.params.id);

        if (pollIndex === -1) {
            res.status(404).json({
                success: false,
                error: 'Poll not found',
            });
            return;
        }

        const poll = polls[pollIndex];

        if (poll.createdBy !== authReq.user?.id) {
            res.status(403).json({
                success: false,
                error: 'Not authorized to delete this poll',
            });
            return;
        }

        polls.splice(pollIndex, 1);

        res.json({
            success: true,
            message: 'Poll deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to delete poll',
        });
    }
});

// Vote on Poll
router.post('/:id/vote', authenticate, (req: Request, res: Response) => {
    try {
        const authReq = req as AuthRequest;
        const { optionId } = req.body;

        if (!optionId) {
            res.status(400).json({
                success: false,
                error: 'Option ID is required',
            });
            return;
        }

        const poll = polls.find((p) => p.id === req.params.id);

        if (!poll) {
            res.status(404).json({
                success: false,
                error: 'Poll not found',
            });
            return;
        }

        const option = poll.options.find((o) => o.id === optionId);

        if (!option) {
            res.status(400).json({
                success: false,
                error: 'Invalid option',
            });
            return;
        }

        // Check if user already voted
        const existingVote = votes.find(
            (v) => v.pollId === poll.id && v.userId === authReq.user?.id
        );

        if (existingVote) {
            // Update vote
            const oldOption = poll.options.find((o) => o.id === existingVote.optionId);
            if (oldOption) oldOption.votes--;

            existingVote.optionId = optionId;
            option.votes++;
        } else {
            // Create new vote
            votes.push({
                id: uuidv4(),
                pollId: poll.id,
                userId: authReq.user?.id || 'unknown',
                optionId,
                createdAt: new Date(),
            });

            option.votes++;
            poll.totalVotes++;
        }

        // Create notification for poll creator
        if (poll.createdBy !== authReq.user?.id) {
            notifications.push({
                id: uuidv4(),
                userId: poll.createdBy,
                title: 'New Vote',
                message: `Someone voted on your poll: ${poll.question}`,
                type: 'vote',
                read: false,
                createdAt: new Date(),
                data: { pollId: poll.id },
            });
        }

        res.json({
            success: true,
            data: poll,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to vote',
        });
    }
});

export default router;
