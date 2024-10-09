import ConflictError from '@/http/errors/conflict-error';
import bcrypt from 'bcryptjs';
import type { CreateUserInterface } from '../typeorm/entities/interfaces/UserInterface';
import type UserRepositoryInterface from '../typeorm/repositories/interfaces/UserRepositoryInterface';
import type UserServiceInterface from './interfaces/UserServiceInterface';

export default class UserService implements UserServiceInterface {
	constructor(private repository: UserRepositoryInterface) {}

	async save(user: CreateUserInterface) {
		const existingUser = await this.repository.findActiveUserByEmail(
			user.email,
		);

		if (existingUser) {
			throw new ConflictError('Email already registered');
		}

		user.password = await bcrypt.hash(user.password, 10);
		return await this.repository.save(user);
	}

	async findActiveUserByEmail(email: string) {
		return await this.repository.findActiveUserByEmail(email);
	}
}
