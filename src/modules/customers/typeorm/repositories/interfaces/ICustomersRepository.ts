import Customer from '../../entities/Customer';
import {
	ICreateCustomer,
	ICustomer,
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
	delete(id: string): Promise<ICustomer | null>;
}
