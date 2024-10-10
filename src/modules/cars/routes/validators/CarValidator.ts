import { z } from 'zod';

export const idCarSchema = z
	.string({
		message: 'insert a valid uuid',
	})
	.uuid()
	.min(1);
