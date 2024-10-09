import type {
  CreateUserInterface,
  UserDetailsInterface,
} from "../../entities/interfaces/UserInterface";

export default interface UserServiceInterface {
  save(user: CreateUserInterface): Promise<UserDetailsInterface | undefined>;
  findActiveUserByEmail(email: string): Promise<UserDetailsInterface | null>;
  findById(id: string): Promise<UserDetailsInterface | null>;
}
