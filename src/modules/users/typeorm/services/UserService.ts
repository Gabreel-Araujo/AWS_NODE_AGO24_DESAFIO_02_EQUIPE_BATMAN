import {
  CreateUserInterface,
  UserDetailsInterface,
} from "../entities/interfaces/UserInterface";
import UserRepositoryInterface from "../repositories/interfaces/UserRepositoryInterface";
import UserServiceInterface from "./interfaces/UserServiceInterface";

export default class UserService implements UserServiceInterface {
  constructor(private repository: UserRepositoryInterface) {}

  save(user: CreateUserInterface) {
    return this.repository.save(user);
  }
}
