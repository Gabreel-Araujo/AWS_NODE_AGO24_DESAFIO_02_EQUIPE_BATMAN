import { ICustomer } from '../../entities/interfaces/CustomerInterface';
import { ICustomerPagination } from './ICustomerPagination';

export type SearchParams = {
	page: number;
	skip: number;
	take: number;
	email?: string;
	cpf?: string;
	name?: string;
	deleted?: 'true' | 'false';
};
export interface ICustomersRepository {
	findAll({ page, skip, take }: SearchParams): Promise<ICustomerPagination>;
	findById(id: string): Promise<ICustomer | null>;
	delete(id: string): Promise<ICustomer | null>;
}
