import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodSchema } from 'zod';

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
			const schemazod = schema.parse(data);
			req[field] = schemazod;
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
