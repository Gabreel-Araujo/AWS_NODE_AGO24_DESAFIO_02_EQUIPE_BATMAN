import { IsNull, Repository } from 'typeorm';
import type {
	CreateUserInterface,
	UserDetailsInterface,
} from '../entities/interfaces/UserInterface';
import type UserRepositoryInterface from './interfaces/UserRepositoryInterface';
import User from '../entities/User';
import { dbConnection } from '@/lib/typeorm';

export default class UserRepository implements UserRepositoryInterface {
	private ormRepository: Repository<User>;

	constructor() {
		this.ormRepository = dbConnection.getRepository(User);
	}

	async save(user: CreateUserInterface): Promise<UserDetailsInterface> {
		const newUser = this.ormRepository.create(user);

		await this.ormRepository.save(newUser);

		return newUser as UserDetailsInterface;
	}

	async findById(id: string): Promise<UserDetailsInterface | null> {
		return this.ormRepository.findOne({ where: { id } });
	}

	async findActiveUserByEmail(
		email: string,
	): Promise<UserDetailsInterface | null> {
		return this.ormRepository.findOne({
			where: { email, deletedAt: IsNull() },
		});
	}

	async softDeleteUser(id: string): Promise<UserDetailsInterface | null> {
		const user = await this.ormRepository.findOne({ where: { id } });
		if (!user) {
			return null;
		}
		user.deletedAt = new Date();

		await this.ormRepository.save(user);
		return user;
	}

	async updateUser(
		id: string,
		data: Partial<CreateUserInterface>,
	): Promise<UserDetailsInterface | null> {
		const user = await this.findById(id);

		if (!user || user.deletedAt) {
			return null;
		}

		const updateUser = { ...user, ...data };

		await this.ormRepository.save(updateUser);

		return updateUser;
	}
}
