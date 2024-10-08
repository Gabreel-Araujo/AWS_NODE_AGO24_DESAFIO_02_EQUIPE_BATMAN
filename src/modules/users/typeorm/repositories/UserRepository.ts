import { Repository } from "typeorm";
import {
  CreateUserInterface,
  UserDetailsInterface,
} from "../entities/interfaces/UserInterface";
import UserRepositoryInterface from "./interfaces/UserRepositoryInterface";

export default class UserRepository implements UserRepositoryInterface {
  constructor(private repository: Repository<UserDetailsInterface>) {}

  async save(user: CreateUserInterface): Promise<UserDetailsInterface> {
    const newUser = this.repository.create(user);
    return this.repository.save(newUser);
  }
}
