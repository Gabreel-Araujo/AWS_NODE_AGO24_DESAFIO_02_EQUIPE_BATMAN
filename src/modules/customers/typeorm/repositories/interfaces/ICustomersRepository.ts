import {
	ICreateCustomer,
	ICustomer,
} from '../../entities/interfaces/CustomerInterface';

export interface ICustomersRepository {
	findById(id: string): Promise<ICustomer | null>;
	save(customer: ICreateCustomer): Promise<ICustomer>;
	findActiveCustomerByEmail(email: string): Promise<ICustomer | null>;
	findCustomerByCPF(cpf: string): Promise<ICustomer | null>;
	delete(id: string): Promise<ICustomer | null>;
}
