import User from '../../entities/User';
import type {
	CreateUserInterface,
	UserDetailsInterface,
} from '../../entities/interfaces/UserInterface';

export default interface UserRepositoryInterface {
	save: (user: CreateUserInterface) => Promise<UserDetailsInterface>;
	findActiveUserByEmail: (
		email: string,
	) => Promise<UserDetailsInterface | null>;
	findById: (id: string) => Promise<UserDetailsInterface | null>;
	softDeleteUser: (id: string) => Promise<UserDetailsInterface | null>;
	updateUser(
		id: string,
		data: Partial<CreateUserInterface>,
	): Promise<UserDetailsInterface | null>;
	getAllUsers(
		limit: number,
		page: number,
		filters: Partial<User>,
		sortBy: string,
		sortOrder: 'ASC' | 'DESC',
	): Promise<[User[], number]>;
}
