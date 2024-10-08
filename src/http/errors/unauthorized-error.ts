import { ApiError } from './api-error';

export default class UnauthorizedError extends ApiError {
	constructor(message: string) {
		const msg = message ?? 'unauthorized';
		super(msg, 401);
	}
}
