import { z } from 'zod';

export const getCustomerIdSchema = z.object({
	id: z.string().uuid({ message: 'insert a valid id' }),
});

export const postCustomerSchema = z.object({
	name: z.string({ message: 'fullName is required' }).min(1),
	birth: z.coerce.date({ message: 'birth is required' }),
	cpf: z.coerce
		.string({ message: 'cpf is required' })
		.regex(/^\d{11}$/, 'Invalid CPF format, must have 11 digits'),
	email: z.string({ message: 'email is required' }).email(),
	phone_number: z.string({ message: 'phone is required' }).min(1),
});

// export const getCustomersParamsSchema

export const getCustomerQuerySchema = z.object({
	name: z
		.string()
		.regex(/^[A-Z][a-z]*$/)
		.optional(),
	email: z.string().optional(),
	cpf: z
		.string({ message: 'cpf is required' })
		.regex(/^\d{11}$/, 'Invalid CPF format, must have 11 digits')
		.optional(),
		deleted: z.string().regex(/^(true|false)$/, "Invalid deleted format, must be 'true' or 'false'").optional(),
	order: z.string().regex(/^(asc|desc)$/, "Invalid order format, must be 'asc' or 'esc'").optional(),
	orderBy: z.string().regex(/^(name|createdAt|deletedAt)$/, "Invalid orderBy format, must be 'name' or 'createdAt' or 'deletedAt'").optional(),
});
