import "reflect-metadata";
import { env } from "@/env";
import { app } from "@/app";
import { dbConnection } from "@/lib/typeorm";
import UserRepository from "@/modules/users/typeorm/repositories/UserRepository";
import User from "@/modules/users/typeorm/entities/User";

async function startServer() {
  try {
    await dbConnection.initialize();
    // const repo = new UserRepository(dbConnection.getRepository(User));
    // const user = await repo.save({ email: "teste3", fullName: "teste3", password: "teste3" });
	// console.log(user)

    console.log("Conected to the database storage 🚧");

    app.listen(env.PORT, () => {
      console.log(`Server is running on port ${env.PORT} 🚀`);
    });
  } catch (error) {
    console.error("Error while establishing database connection", error);
    process.exit(1);
  }
}

startServer();
