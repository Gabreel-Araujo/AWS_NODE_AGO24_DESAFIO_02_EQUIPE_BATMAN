import type { CreateUserInterface } from "../entities/interfaces/UserInterface";
import type UserRepositoryInterface from "../repositories/interfaces/UserRepositoryInterface";
import type UserServiceInterface from "./interfaces/UserServiceInterface";
import bcrypt from "bcryptjs";
import UnauthorizedError from "@/http/errors/unauthorized-error";

export default class UserService implements UserServiceInterface {
  constructor(private repository: UserRepositoryInterface) {}

  async save(user: CreateUserInterface) {
    user.password = await bcrypt.hash(user.password, 10);
    return this.repository.save(user);
  }

  async findActiveUserByEmail(email: string) {
    const user = await this.repository.findActiveUserByEmail(email);
    if (!user) throw new UnauthorizedError("invalid email or password");
    return user;
  }
}
