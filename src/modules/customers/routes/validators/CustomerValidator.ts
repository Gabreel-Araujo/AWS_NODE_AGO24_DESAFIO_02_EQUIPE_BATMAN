import { z } from 'zod';

export const getCustomerSchema = z
	.string({ message: 'insert a valid id' })
	.uuid()
	.min(1);
