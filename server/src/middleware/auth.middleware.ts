import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
    userId?: string;
}

const PUBLIC_ROUTES = ['/api/auth/register', '/api/auth/login']

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]

    if (PUBLIC_ROUTES.includes(req.path)) {
        return next()
    }

    if(!token) {
        return res.status(401).json({error: 'Token mancante'})
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_KEY!) as {userId: string}
        req.userId = payload.userId
        next()
    } catch (error) {
        res.status(401).json({ error: 'Token non valido o scaduto' })
    }
}