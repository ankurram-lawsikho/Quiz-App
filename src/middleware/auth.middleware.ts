import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/jwt';
import { IJwtPayload } from '../types/auth.types';

declare global {
    namespace Express {
        interface Request {
            user?: IJwtPayload;
        }
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

export const requirePermission = (resource: string, action: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const requiredPermission = `${resource}:${action}`;
        const hasPermission = req.user.permissions.includes(requiredPermission);

        if (!hasPermission) {
            return res.status(403).json({ 
                message: `Permission denied: ${requiredPermission}` 
            });
        }

        next();
    };
};

export const requireRole = (roleName: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const hasRole = req.user.roles.includes(roleName);

        if (!hasRole) {
            return res.status(403).json({ 
                message: `Role required: ${roleName}` 
            });
        }

        next();
    };
};
