import 'reflect-metadata';
import 'express-async-errors';
import { env } from '@/env';
import { app } from '@/app';
import { dbConnection } from '@/lib/typeorm';

async function startServer() {
  try {
    await dbConnection.initialize();
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
