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
		return await this.ormRepository.save(newUser);
	}

	findActiveUserByEmail = async (
		email: string,
	): Promise<UserDetailsInterface | null> => {
		return await this.ormRepository.findOne({
			where: { email, deletedAt: IsNull() },
		});
	};
}
