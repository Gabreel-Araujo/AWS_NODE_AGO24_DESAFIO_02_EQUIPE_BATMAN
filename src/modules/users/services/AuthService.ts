import type AuthServiceInterface from '@/modules/users/services/interfaces/AuthServiceInterface';
import bcrypt from 'bcryptjs';
import UserRepositoryInterface from '../typeorm/repositories/interfaces/UserRepositoryInterface';
import UserRepository from '../typeorm/repositories/UserRepository';
import UnauthorizedError from '@/http/errors/unauthorized-error';
import ValidationError from '@/http/errors/validation-error';

export default class AuthService implements AuthServiceInterface {
	private repository: UserRepositoryInterface;

	constructor() {
		this.repository = new UserRepository();
	}

	authenticate = async (email: string, password: string) => {
		if (!email) {
			throw new ValidationError('email is required');
		}

		if (!password) {
			throw new ValidationError('password is required');
		}

		const user = await this.repository.findActiveUserByEmail(email);

		if (!user) {
			throw new ValidationError('invalid email or password');
		}

		const comparePasswords = await bcrypt.compare(password, user.password);

		if (!comparePasswords) {
			throw new UnauthorizedError('invalid email or password');
		}

		return user;
	};
}
