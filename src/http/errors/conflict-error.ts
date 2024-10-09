import { ApiError } from './api-error';

export default class ConflictError extends ApiError {
	constructor(message: string) {
		super(message, 409);
	}
}
