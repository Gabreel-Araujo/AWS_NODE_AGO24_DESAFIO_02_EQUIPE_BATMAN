import { z } from 'zod';

export const postOrderSchema = z.object({
	customer_id: z
		.string()
		.uuid({ message: 'insert a valid id in customer_id, must be uuid format' }),
	car_id: z
		.string()
		.uuid({ message: 'insert a valid id in car_id, must be uuid format' }),
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
