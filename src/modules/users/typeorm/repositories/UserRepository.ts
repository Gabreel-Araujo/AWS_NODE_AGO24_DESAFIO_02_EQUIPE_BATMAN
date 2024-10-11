import { IsNull, Repository } from 'typeorm';
import type {
	CreateUserInterface,
	UserDetailsInterface,
} from '../entities/interfaces/UserInterface';
import type UserRepositoryInterface from './interfaces/UserRepositoryInterface';
import User from '../entities/User';
import { dbConnection } from '@/lib/typeorm';

type UserFilters = Partial<Record<keyof User, string | boolean>>;

export default class UserRepository implements UserRepositoryInterface {
	private ormRepository: Repository<User>;

	constructor() {
		this.ormRepository = dbConnection.getRepository(User);
	}

	save: (user: CreateUserInterface) => Promise<UserDetailsInterface>;

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

		return user;
	}

	async getAllUsers(
		page: number,
		limit: number,
		filters: Partial<User>,
		sortBy: string,
		sortOrder: 'ASC' | 'DESC',
	): Promise<[User[], number]> {
		const queryBuilder = this.ormRepository.createQueryBuilder('user');
		console.log('object keys ', Object.keys(filters));
		for (const key of Object.keys(filters) as Array<keyof User>) {
			if (key === 'deletedAt') {
				if (filters.deletedAt) {
					queryBuilder.andWhere('user.deletedAt IS NOT NULL');

					console.log('os deletados:', filters.deletedAt);
				} else {
					queryBuilder.andWhere('user.deletedAt IS NULL');
					console.log('filter do else ', filters.deletedAt);
				}
			} else {
				queryBuilder.andWhere(`user.${key} LIKE :${key}`, {
					[key]: `%${filters[key]}%`,
				});
				console.log('key:', key);
			}
		}

		const validSortFields = ['fullName', 'createdAt', 'deletedAt'];
		if (validSortFields.includes(sortBy)) {
			queryBuilder.orderBy(`user.${sortBy}`, sortOrder);
		}

		const result = await queryBuilder
			.skip((page - 1) * limit)
			.take(limit)
			.getManyAndCount();

		return result;
	}
}
