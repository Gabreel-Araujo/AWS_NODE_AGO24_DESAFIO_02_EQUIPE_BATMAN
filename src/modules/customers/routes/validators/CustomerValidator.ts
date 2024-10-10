import { z } from 'zod';

export const getCustomerIdSchema = z
	.string({ message: 'insert a valid id' })
	.uuid()
	.min(1);
