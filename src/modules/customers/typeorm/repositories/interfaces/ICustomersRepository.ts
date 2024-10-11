import { ICustomerPagination } from './ICustomerPagination';
import {
	ICreateCustomer,
	ICustomer,
} from '../../entities/interfaces/CustomerInterface';

export type SearchParams = {
	page: number;
	skip: number;
	take: number;
	email?: string;
	cpf?: string;
	name?: string;
	deleted?: 'true' | 'false';
	orderBy?: string[] | null;
	order?: 'ASC' | 'DESC' | null;
};

export interface ICustomersRepository {
	findAll({ page, skip, take }: SearchParams): Promise<ICustomerPagination>;
	findById(id: string): Promise<ICustomer | null>;
	save(customer: ICreateCustomer): Promise<ICustomer>;
	findActiveCustomerByEmail(email: string): Promise<ICustomer | null>;
	findCustomerByCPF(cpf: string): Promise<ICustomer | null>;
	delete(id: string): Promise<ICustomer | null>;
}
