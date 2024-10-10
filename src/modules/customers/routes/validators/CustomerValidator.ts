import { z } from 'zod';

export const getCustomerSchema = z
	.string({ message: 'insert a valid id' })
	.uuid()
	.min(1);

export const postCustomerSchema = z.object({
	birth: z
		.string()
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
});
