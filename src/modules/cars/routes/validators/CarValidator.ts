import { z } from 'zod';

export const idCarSchema = z
	.string({
		message: 'insert a valid uuid',
	})
	.uuid()
	.min(1);

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
		.min(new Date().getFullYear() - 11, {
			message: 'must be at least 1886',
		})
		.max(new Date().getFullYear() + 1, { message: 'cannot be in the future' }),

	daily_price: z.number({
		invalid_type_error: 'must be a number',
	}),

	km: z
		.number({
			invalid_type_error: 'must be a number',
		})
		.int({
			message: 'must be an interger',
		}),

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
		}),
});
