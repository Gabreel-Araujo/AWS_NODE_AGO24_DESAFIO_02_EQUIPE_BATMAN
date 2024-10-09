import { env } from '@/env';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/unauthorized-error';

export function authenticate(req: Request, res: Response, next: NextFunction) {
	try {
		const auth = req.get('Authorization');
		const token = auth?.startsWith('Bearer') ? auth.split(' ')[1] : null;

		if (!token) {
			throw new UnauthorizedError('invalid token');
		}

		jwt.verify(token, env.SECRET_KEY);

		next();
	} catch (error: any) {
		if (error.name === 'TokenExpiredError') {
			next(new UnauthorizedError('Token expired'));
		} else if (error.name === 'JsonWebTokenError') {
			next(new UnauthorizedError('Invalid token'));
		} else {
			next(error);
		}
	}
}
