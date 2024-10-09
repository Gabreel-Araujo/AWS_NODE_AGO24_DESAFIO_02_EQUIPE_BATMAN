import type AuthServiceInterface from "./interfaces/AuthServiceInterface";
import type UserServiceInterface from "@/modules/users/typeorm/services/interfaces/UserServiceInterface";
import bcrypt from "bcryptjs";

export default class AuthService implements AuthServiceInterface {
  constructor(private service: UserServiceInterface) {}

  authenticate = async (email: string, password: string) => {
    const user = await this.service.findActiveUserByEmail(email);

    if (!user) return;

    const comparePasswords = await bcrypt.compare(password, user.password);

    return comparePasswords ? user : null;
  };
}
