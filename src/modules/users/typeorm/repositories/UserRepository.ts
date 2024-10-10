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

	save: (user: CreateUserInterface) => Promise<UserDetailsInterface>;

	findActiveUserByEmail = async (
		email: string,
	): Promise<UserDetailsInterface | null> => {
		return this.ormRepository.findOne({
			where: { email, deletedAt: IsNull() },
		});
	};

	async findById(id: string): Promise<UserDetailsInterface | null> {
		return this.ormRepository.findOne({ where: { id } });
	}
}
