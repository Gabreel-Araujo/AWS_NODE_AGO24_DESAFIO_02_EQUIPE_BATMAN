import { ICustomer } from '../../entities/interfaces/CustomerInterface';

export interface ICustomersRepository {
	findById(id: string): Promise<ICustomer | null>;
}
