import type { UserDetailsInterface } from "@/modules/users/typeorm/entities/interfaces/UserInterface";

export default interface AuthRepositoryInterface {
  authenticate: (
    email: string,
    password: string
  ) => Promise<UserDetailsInterface | null | undefined>;
}
