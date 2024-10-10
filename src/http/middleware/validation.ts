import { ZodSchema, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';

const ALLOWED_FIELDS = {
	params: 'params',
	body: 'body',
	query: 'query',
	headers: 'headers',
} as const;

type Field = keyof typeof ALLOWED_FIELDS;

const validation = (
	schema: ZodSchema<any>,
	field: Field = 'body',
): ((req: Request, res: Response, next: NextFunction) => void) => {
	return (req, res, next) => {
		try {
			const data = req[field];
			schema.parse(data);
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				return res.status(400).json({
					message: 'validation error',
					errors: error.errors.map((err) => err.message),
				});
			}
			next(error);
		}
	};
};

export default validation;
