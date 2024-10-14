import { z } from 'zod';

export const postOrderSchema = z.object({
	customer_id: z
		.string()
		.uuid({ message: 'insert a valid id in customer_id, must be uuid format' }),
	car_id: z
		.string()
		.uuid({ message: 'insert a valid id in car_id, must be uuid format' }),
});
