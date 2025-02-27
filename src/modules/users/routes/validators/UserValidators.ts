import { z } from 'zod';

export const postUserSchema = z.object({
	fullName: z
		.string({
			required_error: 'name is required',
			invalid_type_error: 'name must be a string',
		})
		.refine((name) => name.trim() !== '', {
			message: 'name cannot be null',
		}),
	email: z
		.string({
			required_error: 'email is required',
			invalid_type_error: 'email must be a string',
		})
		.email({
			message: 'invalid email address',
		}),
	password: z
		.string({
			required_error: 'password is required',
			invalid_type_error: 'password must be a string',
		})
		.min(8, "password must be at least 8 characters long'")
		.refine((password) => password.trim() !== '', {
			message: 'password cannot be null',
		}),
});

export const idUserSchema = z.object({
	id: z.string().uuid().min(1),
});

export const putUserSchema = z.object({
	fullName: z
		.string({
			invalid_type_error: 'name must be a string',
		})
		.refine((name) => name.trim() !== '', {
			message: 'name cannot be null',
		})
		.optional(),
	email: z
		.string({
			invalid_type_error: 'email must be a string',
		})
		.email({
			message: 'invalid email address',
		})
		.optional(),
	password: z
		.string({
			invalid_type_error: 'password must be a string',
		})
		.min(8, "password must be at least 8 characters long'")
		.refine((password) => password.trim() !== '', {
			message: 'password cannot be null',
		})
		.optional(),
});

export const queryParamsSchema = z.object({
	page: z.coerce.number().min(1).optional().default(1),
	limit: z.coerce.number().min(1).optional().default(10),
	name: z.string().optional(),
	email: z.string().email().optional(),
	deleted: z.preprocess(
		(val) => (val === 'true' ? true : val === 'false' ? false : val),
		z.boolean().optional(),
	),
	sortBy: z
		.enum(['name', 'createdAt', 'deletedAt'])
		.optional()
		.default('createdAt'),
	sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});
