import { Repository } from "typeorm";
import {
  CreateUserInterface,
  UserDetailsInterface,
} from "../entities/interfaces/UserInterface";
import UserRepositoryInterface from "./interfaces/UserRepositoryInterface";
import User from "../entities/User";

export default class UserRepository implements UserRepositoryInterface {
  constructor(private repository: Repository<User>) {}

  async save(user: CreateUserInterface): Promise<UserDetailsInterface> {
    const newUser = this.repository.create(user);
    return this.repository.save(newUser);
  }
}
