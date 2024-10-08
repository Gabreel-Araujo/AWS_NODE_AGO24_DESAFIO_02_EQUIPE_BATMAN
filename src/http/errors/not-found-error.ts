import { ApiError } from './api-error';

export default class NotFoundError extends ApiError {
	constructor(message: string) {
		const msg = message ?? 'not found';
		super(msg, 404);
	}
}
