import {
	ICreateCustomer,
	ICustomer,
	IUpdateCustomer,
} from '../../typeorm/entities/interfaces/CustomerInterface';

export interface ICustomerService {
	execute(id: string): Promise<ICustomer>;
	save(customer: ICreateCustomer): Promise<ICustomer>;
	update(id: string, customer: IUpdateCustomer): void;
}
