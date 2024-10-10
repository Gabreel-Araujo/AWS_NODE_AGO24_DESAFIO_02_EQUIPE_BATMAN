import { ICustomer } from '../../typeorm/entities/interfaces/CustomerInterface';

export interface ICustomerService {
	execute(id: string): Promise<ICustomer>;
}
