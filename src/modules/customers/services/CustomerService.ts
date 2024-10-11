import {
	ICreateCustomer,
	ICustomer,
	IUpdateCustomer,
} from '../typeorm/entities/interfaces/CustomerInterface';
import { ICustomerService } from './interfaces/CustomerServiceInterface';
import NotFoundError from '@/http/errors/not-found-error';
import { ICustomersRepository } from '../typeorm/repositories/interfaces/ICustomersRepository';
import CustomersRepository from '../typeorm/repositories/CustomerRepository';
import ConflictError from '@/http/errors/conflict-error';

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

	public async save(customer: ICreateCustomer): Promise<ICustomer> {
		const newCustomer = await this.repository.save(customer);

		return newCustomer;
	}

	public async delete(id: string): Promise<ICustomer | null> {
		const customer = await this.repository.findById(id);

		if (!customer) {
			throw new NotFoundError('Customer not found.');
		}

		customer.deleted_at = null;

		const deletedUser = await this.repository.delete(id);

		return deletedUser;
	}

	public async update(id: string, customer: IUpdateCustomer): Promise<void> {
		const customerToUpdate = await this.repository.findActiveCustomerByID(id);

		if (!customerToUpdate) throw new NotFoundError('customer not found');

		await this.repository.updateCustomer(id, customer);
	}
}
