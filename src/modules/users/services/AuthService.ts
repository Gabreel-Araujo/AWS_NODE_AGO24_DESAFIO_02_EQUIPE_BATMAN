import type AuthServiceInterface from '@/modules/users/services/interfaces/AuthServiceInterface';
import type UserServiceInterface from '@/modules/users/services/interfaces/UserServiceInterface';
import bcrypt from 'bcryptjs';

export default class AuthService implements AuthServiceInterface {
	constructor(private service: UserServiceInterface) {}

	authenticate = async (email: string, password: string) => {
		const user = await this.service.findActiveUserByEmail(email);

		if (!user) {
			return null;
		}

		const comparePasswords = await bcrypt.compare(password, user.password);

		return comparePasswords ? user : null;
	};
}
