import type {
  CreateUserInterface,
  UserDetailsInterface,
} from "../../entities/interfaces/UserInterface";

export default interface UserServiceInterface {
  save(user: CreateUserInterface): Promise<UserDetailsInterface | undefined>;

  findActiveUserByEmail(email: string): Promise<UserDetailsInterface | null>;

  findById(id: string): Promise<UserDetailsInterface | null>;

  softDeleteUser(id: string): Promise<UserDetailsInterface | null>;

  updateUser: (
    id: string,
    data: Partial<CreateUserInterface>
  ) => Promise<UserDetailsInterface | null>;

  findUsers(page: number, limit: number): Promise<UserDetailsInterface[]>;
}
