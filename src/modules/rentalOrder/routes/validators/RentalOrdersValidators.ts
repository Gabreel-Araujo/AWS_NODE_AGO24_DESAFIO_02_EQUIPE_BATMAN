import { ApiError } from '@/http/errors/api-error';
import NotFoundError from '@/http/errors/not-found-error';
import { z } from 'zod';

enum RentalRates {
	AC = 40.0,
	AL = 30.0,
	AP = 30.0,
	AM = 20.0,
	BA = 50.0,
	CE = 80.0,
	ES = 30.0,
	GO = 80.0,
	MA = 60.0,
	MT = 50.0,
	MS = 50.0,
	MG = 80.0,
	PB = 30.0,
	PR = 40.0,
	PE = 30.0,
	PI = 80.0,
	RJ = 50.0,
	RN = 80.0,
	RS = 80.0,
	RO = 70.0,
	RR = 40.0,
	SC = 50.0,
	SE = 80.0,
	TO = 40.0,
}

export const postOrderSchema = z.object({
	customer_id: z
		.string()
		.uuid({ message: 'insert a valid id in customer_id, must be uuid format' }),
	car_id: z
		.string()
		.uuid({ message: 'insert a valid id in car_id, must be uuid format' }),
});

export const updateOrderSchema = z
	.object({
		status: z.enum(['aproved', 'closed', 'canceled'], {
			required_error: 'status is required',
		}),
		start_date: z
			.string()
			.datetime('start_date must be valid date')
			.refine(
				(value) => {
					const dateValue = new Date(value);
					return dateValue.getTime() >= Date.now();
				},
				{ message: 'start_date cannot be in the past' },
			)
			.optional(),
		end_date: z.string().datetime('end_date must be valid date').optional(),
		cep: z
			.string({ required_error: 'cep is required' })
			.refine(
				(cep) => {
					return /^\d{5}-?\d{3}$/.test(cep);
				},
				{
					message: 'cep must be a valid format (xxxxx-xxx or xxxxxxxxx)',
				},
			)
			.optional(),
		cancellation_date: z
			.string()
			.datetime('cancellation_date must be valid date')
			.optional(),
		closing_date: z
			.string()
			.datetime('closing_date must be valid date')
			.optional(),
	})
	.refine(
		(data) => {
			if (data.status === 'aproved') {
				return data.start_date !== undefined && data.start_date !== null;
			}

			return true;
		},
		{ message: 'start_date is required for aprove order' },
	)
	.refine(
		(data) => {
			if (data.status === 'aproved') {
				return data.end_date !== undefined && data.end_date !== null;
			}

			return true;
		},
		{ message: 'end_date is required for aprove order' },
	)
	.refine(
		(data) => {
			if (data.status === 'aproved') {
				return data.cep !== undefined && data.cep !== null;
			}

			return true;
		},
		{ message: 'cep is required for aprove order' },
	)
	.refine(
		(data) => {
			if (data.status === 'canceled') {
				return (
					data.cancellation_date !== undefined &&
					data.cancellation_date !== null
				);
			}
			return true;
		},
		{ message: 'cancellation_date is required for cancel order' },
	)
	.refine(
		(data) => {
			if (data.status === 'closed') {
				return data.closing_date !== undefined && data.closing_date !== null;
			}

			return true;
		},
		{ message: 'closing_date is required for close order' },
	);

export const validateCep = async (cep: string) => {
	const response = await fetch(`https://viacep.com.br/ws/${cep}/json`);
	if (!response.ok) {
		if (response.status === 404) {
			throw new NotFoundError('cep not found');
		}

		throw new Error(`Error fetching CEP: ${response.statusText}`);
	}

	const data = await response.json();
	if (data.erro) {
		throw new ApiError('invalid CEP', 400);
	}

	const { localidade, uf } = data;

	const rentalRate: number = RentalRates[uf as keyof typeof RentalRates] || 170;

	return { localidade, uf, rentalRate };
};
