import type {
	CreateUserInterface,
	UserDetailsInterface,
} from '../../entities/interfaces/UserInterface';

export default interface UserRepositoryInterface {
	save: (user: CreateUserInterface) => Promise<UserDetailsInterface>;
	findActiveUserByEmail: (
		email: string,
	) => Promise<UserDetailsInterface | null>;
}
