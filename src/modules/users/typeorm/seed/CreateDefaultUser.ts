import { dbConnection } from "@/lib/typeorm";
import User from "../entities/User";
import { env } from "@/env";
import bcrypt from "bcryptjs";

export default class CreateDefaultUser {
  async execute() {
    const repository = dbConnection.getRepository(User);

    const userExists = await repository.findOne({
      where: { email: env.DEFAULT_USER_EMAIL },
    });

    if (userExists) return;

    const encryptedPassword = await bcrypt.hash(env.DEFAULT_USER_PASSWORD, 10);

    const createdUser = repository.create({
      fullName: env.DEFAULT_USER_NAME,
      email: env.DEFAULT_USER_EMAIL,
      password: encryptedPassword,
    });

    await repository.save(createdUser);

    console.log("default user created");
  }
}
