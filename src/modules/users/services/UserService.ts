import ConflictError from '@/http/errors/conflict-error';
import bcrypt from 'bcryptjs';
import type {
	CreateUserInterface,
	UserDetailsInterface,
} from '../typeorm/entities/interfaces/UserInterface';
import type UserRepositoryInterface from '../typeorm/repositories/interfaces/UserRepositoryInterface';
import type UserServiceInterface from './interfaces/UserServiceInterface';
import UserRepository from '../typeorm/repositories/UserRepository';
import NotFoundError from '@/http/errors/not-found-error';

export default class UserService implements UserServiceInterface {
	private repository: UserRepositoryInterface;

	constructor() {
		this.repository = new UserRepository();
	}

	async save({ email, fullName, password }: CreateUserInterface) {
		const existingUser = await this.repository.findActiveUserByEmail(email);

		if (existingUser) {
			throw new ConflictError('Email already registered');
		}

		password = await bcrypt.hash(password, 10);
		return await this.repository.save({ email, fullName, password });
	}

	async findActiveUserByEmail(email: string) {
		const user = await this.repository.findActiveUserByEmail(email);

		if (!user) {
			throw new NotFoundError('User not found');
		}
		return user;
	}

	async findById(id: string): Promise<UserDetailsInterface | null> {
		const user = await this.repository.findById(id);

		if (!user) {
			throw new NotFoundError('User not found');
		}
		return user;
	}

	async softDeleteUser(id: string): Promise<UserDetailsInterface | null> {
		const user = await this.repository.softDeleteUser(id);
		if (!user) {
			throw new NotFoundError('User not found');
		}
		return user;
	}
}
