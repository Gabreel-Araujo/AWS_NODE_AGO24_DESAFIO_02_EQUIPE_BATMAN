import 'reflect-metadata';
import 'express-async-errors';
import { app } from '@/app';
import { env } from '@/env';
import { dbConnection } from '@/lib/typeorm';
import { UserSeed } from '@/seeds/UserSeed';

async function startServer() {
	try {
		await dbConnection.initialize();
		console.log('Conected to the database storage 🚧');

		await UserSeed(dbConnection);

		app.listen(env.PORT, () => {
			console.log(`Server is running on port ${env.PORT} 🚀`);
		});
	} catch (error) {
		console.error('Error while establishing database connection', error);
		process.exit(1);
	}
}

startServer();
