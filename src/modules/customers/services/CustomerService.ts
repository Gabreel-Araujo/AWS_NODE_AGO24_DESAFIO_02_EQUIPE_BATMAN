import { ICustomer } from '../typeorm/entities/interfaces/CustomerInterface';
import { ICustomerService } from './interfaces/CustomerServiceInterface';
import NotFoundError from '@/http/errors/not-found-error';
import { ICustomersRepository } from '../typeorm/repositories/interfaces/ICustomersRepository';
import CustomersRepository from '../typeorm/repositories/CustomerRepository';

export default class CustomerService implements ICustomerService {
	private repository: ICustomersRepository;

	constructor() {
		this.repository = new CustomersRepository();
	}

	public async execute(id: string): Promise<ICustomer> {
		const customer = await this.repository.findById(id);

		if (!customer) {
			throw new NotFoundError('Customer not found.');
		}

		return customer;
	}

	public async delete(id: string): Promise<ICustomer | null> {
		const customer = await this.repository.findById(id);
		if (!customer) {
			throw new NotFoundError('Customer not found.');
		}
		customer.deleted_at = null;
		return await this.repository.delete(id);
	}
}
