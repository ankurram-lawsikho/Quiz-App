import jwt, { SignOptions } from 'jsonwebtoken';
import { IJwtPayload } from '../types/auth.types';

// Allowed values for expiresIn (you can add more if you want)
type JwtExpiry = "24h" | "7d" | "30m" | "1h" | "12h";

export const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
export const JWT_EXPIRES_IN: JwtExpiry = (process.env.JWT_EXPIRES_IN as JwtExpiry) || "24h";

export const generateToken = (payload: IJwtPayload): string => {
    const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };
    return jwt.sign(payload, JWT_SECRET as jwt.Secret, options);
  };

export const verifyToken = (token: string): IJwtPayload => {
    try {
        return jwt.verify(token, JWT_SECRET) as IJwtPayload;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};
