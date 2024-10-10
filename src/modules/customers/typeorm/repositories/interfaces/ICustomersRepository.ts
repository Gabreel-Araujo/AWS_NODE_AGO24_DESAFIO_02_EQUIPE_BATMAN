import { UpdateResult } from 'typeorm';
import {
	ICreateCustomer,
	ICustomer,
	IUpdateCustomer,
} from '../../entities/interfaces/CustomerInterface';

export interface ICustomersRepository {
	findById(id: string): Promise<ICustomer | null>;
	save(customer: ICreateCustomer): Promise<ICustomer>;
	findActiveCustomerByEmail(email: string): Promise<ICustomer | null>;
	findCustomerByCPF(cpf: string): Promise<ICustomer | null>;
	findActiveCustomerByID(id: string): Promise<ICustomer | null>;
	updateCustomer(id: string, customer: IUpdateCustomer): Promise<UpdateResult>;
}
