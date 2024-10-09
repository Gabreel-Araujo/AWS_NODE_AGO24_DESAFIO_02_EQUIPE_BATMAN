import { IsNull, type Repository } from "typeorm";
import type {
  CreateUserInterface,
  UserDetailsInterface,
} from "../entities/interfaces/UserInterface";
import type UserRepositoryInterface from "./interfaces/UserRepositoryInterface";

export default class UserRepository implements UserRepositoryInterface {
  constructor(private repository: Repository<UserDetailsInterface>) {}

  save(user: CreateUserInterface): Promise<UserDetailsInterface> {
    const newUser = this.repository.create(user);
    return this.repository.save(newUser);
  }

  findActiveUserByEmail = (
    email: string
  ): Promise<UserDetailsInterface | null> => {
    return this.repository.findOne({ where: { email, deletedAt: IsNull() } });
  };

  async findById(id: string): Promise<UserDetailsInterface | null> {
    return this.repository.findOne({ where: { id } });
  }

  async softDeleteUser(id: string): Promise<UserDetailsInterface | null> {
    const user = await this.repository.findOne({ where: { id } });
    if (!user) {
      return null;
    }
    user.deletedAt = new Date();

    await this.repository.save(user);
    return user;
  }
}
