import { ApiError } from './api-error';

export default class NotFoundError extends ApiError {
	constructor(message: string) {
		super(message, 404);
	}
}
