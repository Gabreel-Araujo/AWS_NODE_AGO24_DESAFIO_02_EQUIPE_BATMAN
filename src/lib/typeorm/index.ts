import { DataSource } from 'typeorm';
import { env } from '../../env';

export const dbConnection = new DataSource({
	type: 'postgres',
	host: env.HOST,
	port: env.DB_PORT,
	username: env.DB_USER,
	password: env.DB_PASSWORD,
	database: env.DB_NAME,
	entities: ['src/modules/*/typeorm/entities/*.ts'],
	logging: true,
	synchronize: false,
	migrations: ['src/lib/typeorm/migrations/*.ts'],
});
