import type { CreateUserInterface } from "../entities/interfaces/UserInterface";
import type UserRepositoryInterface from "../repositories/interfaces/UserRepositoryInterface";
import type UserServiceInterface from "./interfaces/UserServiceInterface";
import bcrypt from "bcryptjs";

export default class UserService implements UserServiceInterface {
  constructor(private repository: UserRepositoryInterface) {}

  async save(user: CreateUserInterface) {
    user.password = await bcrypt.hash(user.password, 10);
    return await this.repository.save(user);
  }

  async findActiveUserByEmail(email: string) {
    return await this.repository.findActiveUserByEmail(email);
  }
}
