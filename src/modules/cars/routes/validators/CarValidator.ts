import { z } from 'zod';

export const idCarSchema = z.object({
	id: z.string().uuid({ message: 'insert a valid uuid' }), // Validação do UUID
});

export const postCarSchema = z.object({
	plate: z
		.string({
			required_error: 'plate is required',
			invalid_type_error: 'must be a string',
		})
		.min(7)
		.max(7)
		.refine((plate) => plate.trim() !== '', {
			message: 'plate cannot be null',
		}),

	brand: z
		.string({
			required_error: 'brand is required',
			invalid_type_error: 'must be a string',
		})
		.refine((brand) => brand.trim() !== '', {
			message: 'brand cannot be null',
		})
		.refine((brand) => !/\d/.test(brand), {
			message: 'brand cannot contain numbers',
		}),

	model: z
		.string({
			required_error: 'model is required',
			invalid_type_error: 'must be a string',
		})
		.refine((model) => model.trim() !== '', {
			message: 'model cannot be null',
		}),

	year: z
		.number({
			invalid_type_error: 'must be a number',
		})
		.int({
			message: 'must be an interger',
		})
		.min(new Date().getFullYear() - 10, {
			message: 'must be from at most ten years ago',
		})
		.max(new Date().getFullYear() + 1, { message: 'cannot be in the future' }),

	daily_price: z.number({
		invalid_type_error: 'must be a number',
	}),

	km: z.coerce
		.number({
			invalid_type_error: 'must be a number',
		})
		.default(0),

	items: z
		.array(
			z
				.string({
					required_error: 'name is required',
					invalid_type_error: 'must be a string',
				})
				.refine((item) => item.trim() !== '', {
					message: 'name cannot be null',
				}),
		)
		.nonempty({
			message: 'one item is required',
		})
		.max(5, {
			message: 'maximum five items',
		})
		.refine((items) => new Set(items).size === items.length, {
			message: 'duplicate items are not allowed',
		}),
});
