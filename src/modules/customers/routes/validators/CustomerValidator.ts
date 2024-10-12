import { cpf } from 'cpf-cnpj-validator';
import phone from 'phone';
import { z } from 'zod';

export const getCustomerIdSchema = z.object({
	id: z.string().uuid({ message: 'insert a valid id' }),
});

export const getCustomerSchema = z
	.string({ message: 'insert a valid id' })
	.uuid()
	.min(1);

export const postCustomerSchema = z.object({
	name: z
		.string({
			required_error: 'name is required',
			invalid_type_error: 'name must be a string',
		})
		.refine(
			(name) => {
				return !(name.trim() === '');
			},
			{ message: 'name cannot be a empty value' },
		),
	birth: z
		.string({
			required_error: 'birth is required',
			invalid_type_error: 'birth must be a string',
		})
		.refine(
			(value) => {
				const regex = /^\d{4}-\d{2}-\d{2}$/;
				return regex.test(value);
			},
			{ message: 'invalid birth date: use format yyyy-mm-dd' },
		)
		.refine(
			(value) => {
				const [year, month, day] = value.split('-').map(Number);
				const date = new Date(year, month - 1, day);

				return (
					date.getFullYear() === year &&
					date.getMonth() === month - 1 &&
					date.getDate() === day
				);
			},
			{
				message: 'birth date must be a valid date',
			},
		)
		.refine(
			(value) => {
				const date = new Date(value);
				return !(date.getTime() > Date.now());
			},
			{
				message: 'birth cannot be a future date',
			},
		)
		.transform((value) => {
			const [year, month, day] = value.split('-').map(Number);
			return new Date(year, month - 1, day);
		}),
	cpf: z
		.string({
			required_error: 'cpf is required',
			invalid_type_error: 'cpf must be a string',
		})
		.refine(
			(cpf) => {
				return !(cpf.trim() === '');
			},
			{ message: 'cpf cannot be a empty value' },
		)
		.refine(
			(value) => {
				return cpf.isValid(value);
			},
			{ message: 'invalid cpf' },
		),
	email: z
		.string({
			required_error: 'email is required',
			invalid_type_error: 'email must be a string',
		})
		.email('email is invalid'),
	phone_number: z
		.string({
			required_error: 'phone_number is required',
			invalid_type_error: 'phone_number must be a string',
		})
		.refine(
			(phone_number) => {
				return phone(phone_number, { country: 'BR' }).isValid;
			},
			{ message: 'phone_number must be a valid brazilian phone number' },
		),
});

export const putCustomerBodySchema = z.object({
	name: z
		.string({
			invalid_type_error: 'name must be a string',
		})
		.refine(
			(name) => {
				return !(name.trim() === '');
			},
			{ message: 'name cannot be a empty value' },
		)
		.optional(),
	birth: z
		.string({
			invalid_type_error: 'birth must be a string',
		})
		.refine(
			(value) => {
				const regex = /^\d{4}-\d{2}-\d{2}$/;
				return regex.test(value);
			},
			{ message: 'invalid birth date: use format yyyy-mm-dd' },
		)
		.refine(
			(value) => {
				const [year, month, day] = value.split('-').map(Number);
				const date = new Date(year, month - 1, day);

				return (
					date.getFullYear() === year &&
					date.getMonth() === month - 1 &&
					date.getDate() === day
				);
			},
			{
				message: 'birth date must be a valid date',
			},
		)
		.refine(
			(value) => {
				const date = new Date(value);
				return !(date.getTime() > Date.now());
			},
			{
				message: 'birth cannot be a future date',
			},
		)
		.transform((value) => {
			const [year, month, day] = value.split('-').map(Number);
			return new Date(year, month - 1, day);
		})
		.optional(),
	cpf: z
		.string({
			invalid_type_error: 'cpf must be a string',
		})
		.refine(
			(cpf) => {
				return !(cpf.trim() === '');
			},
			{ message: 'cpf cannot be a empty value' },
		)
		.refine(
			(value) => {
				return cpf.isValid(value);
			},
			{ message: 'invalid cpf' },
		)
		.optional(),
	email: z
		.string({
			invalid_type_error: 'email must be a string',
		})
		.email('email is invalid')
		.optional(),
	phone_number: z
		.string({
			invalid_type_error: 'phone_number must be a string',
		})
		.refine(
			(phone_number) => {
				return phone(phone_number, { country: 'BR' }).isValid;
			},
			{ message: 'phone_number must be a valid brazilian phone number' },
		)
		.optional(),
});

export const patchCustomerParamsSchema = z.object({
	id: z.string().uuid({ message: 'id must be a valid uuid' }),
});

export const getCustomerQuerySchema = z.object({
	name: z
		.string({ message: 'name is required' })
		.regex(/^[A-Za-z]+$/, 'Invalid name format, must have only letters')
		.optional(),
	email: z.string().optional(),
	cpf: z
		.string({ message: 'cpf is required' })
		.regex(/^\d{11}$/, 'Invalid CPF format, must have 11 digits')
		.optional(),
	deleted: z
		.string()
		.regex(
			/^(true|false)$/,
			"Invalid deleted format, must be 'true' or 'false'",
		)
		.optional(),
	order: z
		.string()
		.regex(/^(asc|desc)$/, "Invalid order format, must be 'asc' or 'desc'")
		.optional(),
	orderBy: z
		.string()
		.regex(
			/^(name|created_at|deleted_at)(,(name|created_at|deleted_at)){0,2}$/,
			"Invalid orderBy format, must be 'name' or 'created_at' or 'deleted_at'",
		)
		.optional(),
	page: z.coerce
		.number()
		.min(1, { message: 'Page must be at least 1' })
		.optional(),
	limit: z.coerce
		.number()
		.min(1, { message: 'Limit must be at least 1' })
		.optional(),
});
