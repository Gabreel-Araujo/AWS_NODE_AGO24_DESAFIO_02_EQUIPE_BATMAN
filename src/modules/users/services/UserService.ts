import ConflictError from '@/http/errors/conflict-error';
import bcrypt from 'bcryptjs';
import type { CreateUserInterface } from '../typeorm/entities/interfaces/UserInterface';
import type UserRepositoryInterface from '../typeorm/repositories/interfaces/UserRepositoryInterface';
import type UserServiceInterface from './interfaces/UserServiceInterface';
import UserRepository from '../typeorm/repositories/UserRepository';

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
		return await this.repository.findActiveUserByEmail(email);
	}
}
