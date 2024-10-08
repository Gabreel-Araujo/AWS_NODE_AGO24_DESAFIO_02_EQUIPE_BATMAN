import type { CreateUserInterface, UserDetailsInterface } from "../../entities/interfaces/UserInterface";

export default interface UserServiceInterface {
    save(user: CreateUserInterface): Promise<UserDetailsInterface>
}
