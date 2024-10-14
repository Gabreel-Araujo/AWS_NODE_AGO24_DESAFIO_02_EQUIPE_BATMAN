import { z } from 'zod';

export const idCarSchema = z.object({
	id: z.string().uuid({ message: 'insert a valid uuid' }), // Validação do UUID
});
