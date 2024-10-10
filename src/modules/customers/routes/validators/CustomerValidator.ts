import { z } from 'zod';

export const getUserSchema = z
	.string({ message: 'insert a valid id' })
	.uuid()
	.min(1);
