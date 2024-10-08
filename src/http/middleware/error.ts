import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import type { ApiError } from '../errors/api-error';

export default function errorMiddleware(
	error: Error & Partial<ApiError>,
	req: Request,
	res: Response,
	next: NextFunction,
) {
	if (error instanceof ZodError) {
		res
			.status(400)
			.json({ message: 'Validation error', issues: error.format() });
		return;
	}

	const statusCode = error.statusCode ? error.statusCode : 500;
	const message = error.statusCode ? error.message : 'internal server error';

	res.status(statusCode).json({ message });
	return;
}
