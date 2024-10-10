import { z } from 'zod';

export const getCustomerIdSchema = z
	.string({ message: 'insert a valid id' })
	.uuid()
	.min(1);

export const postCustomerSchema = z.object({
	name: z.string({ message: 'fullName is required' }).min(1),
	birth: z.coerce.date({ message: 'birth is required' }),
	cpf: z.coerce
		.string({ message: 'cpf is required' })
		.regex(/^\d{11}$/, 'Invalid CPF format, must have 11 digits'),
	email: z.string({ message: 'email is required' }).email(),
	phone_number: z.string({ message: 'phone is required' }).min(1),
});
