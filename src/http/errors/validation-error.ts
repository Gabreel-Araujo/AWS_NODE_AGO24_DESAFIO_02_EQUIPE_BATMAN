import { ApiError } from './api-error';

export default class ValidationError extends ApiError {
	constructor(message: string) {
		super(message, 400);
	}
}
