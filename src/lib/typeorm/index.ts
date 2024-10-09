import CreateDefaultUser from '@/modules/users/typeorm/seed/CreateDefaultUser';
import { env } from '../../env';
import { DataSource } from 'typeorm';

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