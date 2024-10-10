import type {
	CreateUserInterface,
	UserDetailsInterface,
} from '../../typeorm/entities/interfaces/UserInterface';

export default interface UserServiceInterface {
	save(user: CreateUserInterface): Promise<UserDetailsInterface | undefined>;
	findActiveUserByEmail(email: string): Promise<UserDetailsInterface | null>;
}
