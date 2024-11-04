import { DataSource } from 'typeorm';
import path from 'node:path';
import User from '@/modules/users/typeorm/entities/User';
import Customer from '@/modules/customers/typeorm/entities/Customer';
import Cars from '@/modules/cars/typeorm/entities/Car';
import { Item } from '@/modules/cars/typeorm/entities/Items';
import RentalOrder from '@/modules/rentalOrder/typeorm/entities/RentalOrder';

export const dbConnection = new DataSource({
	type: 'sqlite',
	database: path.resolve(__dirname, '../../../db/mydb.sqlite'),
	entities: [User, Customer, Cars, Item, RentalOrder],
	logging: true,
	synchronize: true,
	migrations: ['build/lib/typeorm/migrations/*.js'],
});

// entities 'build/modules/*/typeorm/entities/*.js'
