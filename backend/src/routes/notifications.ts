import { Request, Response, Router } from 'express';
import { notifications } from '../data/store';
import { authenticate } from '../middleware/auth';

const router = Router();

interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}

// Get All Notifications
router.get('/', authenticate, (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const userNotifications = notifications
        .filter((n) => n.userId === authReq.user?.id)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    res.json({
        success: true,
        data: userNotifications,
    });
});

// Mark Notification as Read
router.patch('/:id/read', authenticate, (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const notification = notifications.find(
        (n) => n.id === req.params.id && n.userId === authReq.user?.id
    );

    if (!notification) {
        res.status(404).json({
            success: false,
            error: 'Notification not found',
        });
        return;
    }

    notification.read = true;

    res.json({
        success: true,
        message: 'Notification marked as read',
    });
});

// Mark All as Read
router.post('/read-all', authenticate, (req: Request, res: Response) => {
    const authReq = req as AuthRequest;

    notifications.forEach((n) => {
        if (n.userId === authReq.user?.id) {
            n.read = true;
        }
    });

    res.json({
        success: true,
        message: 'All notifications marked as read',
    });
});

export default router;
