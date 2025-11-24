import bcrypt from 'bcryptjs';
import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { users } from '../data/store';
import { authenticate } from '../middleware/auth';

const router = Router();

interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}

// Sign Up
router.post('/signup', async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({
                success: false,
                error: 'Name, email, and password are required',
            });
            return;
        }

        // Check if user already exists
        const existingUser = users.find((u) => u.email === email);
        if (existingUser) {
            res.status(400).json({
                success: false,
                error: 'User already exists',
            });
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = {
            id: uuidv4(),
            name,
            email,
            password: hashedPassword,
            createdAt: new Date(),
        };

        users.push(user);

        // Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
                token,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to create user',
        });
    }
});

// Sign In
router.post('/signin', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                success: false,
                error: 'Email and password are required',
            });
            return;
        }

        // Find user
        const user = users.find((u) => u.email === email);
        if (!user) {
            res.status(401).json({
                success: false,
                error: 'Invalid credentials',
            });
            return;
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({
                success: false,
                error: 'Invalid credentials',
            });
            return;
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
                token,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to sign in',
        });
    }
});

// Logout
router.post('/logout', authenticate, (req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'Logged out successfully',
    });
});

// Get Current User
router.get('/me', authenticate, (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const user = users.find((u) => u.id === authReq.user?.id);

    if (!user) {
        res.status(404).json({
            success: false,
            error: 'User not found',
        });
        return;
    }

    res.json({
        success: true,
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    });
});

// Refresh Token
router.post('/refresh', authenticate, (req: Request, res: Response) => {
    const authReq = req as AuthRequest;

    const token = jwt.sign(
        { id: authReq.user?.id, email: authReq.user?.email },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '7d' }
    );

    res.json({
        success: true,
        data: { token },
    });
});

export default router;
