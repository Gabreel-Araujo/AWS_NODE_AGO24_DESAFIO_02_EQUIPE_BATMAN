import User from '../../typeorm/entities/User';
import type {
	CreateUserInterface,
	UserDetailsInterface,
} from '../../typeorm/entities/interfaces/UserInterface';
import { QueryOptions } from '../UserService';

export default interface UserServiceInterface {
	save(user: CreateUserInterface): Promise<UserDetailsInterface | undefined>;
	findActiveUserByEmail(email: string): Promise<UserDetailsInterface | null>;
	softDeleteUser(id: string): Promise<UserDetailsInterface | null>;
	updateUser: (
		id: string,
		data: Partial<CreateUserInterface>,
	) => Promise<UserDetailsInterface | null>;
	findUsers(
		filters: Partial<User>,
		options: QueryOptions,
	): Promise<[User[], number]>;
}
