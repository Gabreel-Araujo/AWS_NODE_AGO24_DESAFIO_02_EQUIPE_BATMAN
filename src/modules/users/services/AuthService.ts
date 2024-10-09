import type AuthServiceInterface from '@/modules/users/services/interfaces/AuthServiceInterface';
import bcrypt from 'bcryptjs';
import UserRepositoryInterface from '../typeorm/repositories/interfaces/UserRepositoryInterface';
import UserRepository from '../typeorm/repositories/UserRepository';

export default class AuthService implements AuthServiceInterface {
	private repository: UserRepositoryInterface;

	constructor() {
		this.repository = new UserRepository();
	}

	authenticate = async (email: string, password: string) => {
		const user = await this.repository.findActiveUserByEmail(email);

		if (!user) {
			return null;
		}

		const comparePasswords = await bcrypt.compare(password, user.password);

		return comparePasswords ? user : null;
	};
}
