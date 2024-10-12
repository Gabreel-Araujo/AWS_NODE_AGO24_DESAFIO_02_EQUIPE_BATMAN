import { UpdateResult } from 'typeorm';
import Customer from '../../entities/Customer';
import {
	ICreateCustomer,
	ICustomer,
	IUpdateCustomer,
} from '../../entities/interfaces/CustomerInterface';

export type SearchParams = {
	skip: number;
	take: number;
	email?: string;
	cpf?: string;
	name?: string;
	deleted?: 'true' | 'false';
	orderBy?: string;
	order?: 'ASC' | 'DESC' | null;
};

export interface ICustomersRepository {
	findAll({ skip, take }: SearchParams): Promise<Customer[]>;
	findById(id: string): Promise<ICustomer | null>;
	save(customer: ICreateCustomer): Promise<ICustomer>;
	findActiveCustomerByEmail(email: string): Promise<ICustomer | null>;
	findCustomerByCPF(cpf: string): Promise<ICustomer | null>;
	findActiveCustomerByID(id: string): Promise<ICustomer | null>;
	updateCustomer(id: string, customer: IUpdateCustomer): Promise<UpdateResult>;
	delete(id: string): Promise<ICustomer | null>;
}
