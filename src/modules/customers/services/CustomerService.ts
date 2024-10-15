import NotFoundError from '@/http/errors/not-found-error';
import ValidationError from '@/http/errors/validation-error';
import {
	ICreateCustomer,
	ICustomer,
	IUpdateCustomer,
} from '../typeorm/entities/interfaces/CustomerInterface';
import CustomersRepository from '../typeorm/repositories/CustomerRepository';
import { ICustomersRepository } from '../typeorm/repositories/interfaces/ICustomersRepository';
import { CustomerPaginationServiceInterface } from './interfaces/CustomerPaginationServiceInterface';
import { ICustomerService } from './interfaces/CustomerServiceInterface';
import { SearchParamsInterface } from './interfaces/SearchParamsInterface';

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

	public async listAll({
		page,
		limit,
		order,
		orderBy,
		name,
		email,
		cpf,
		deleted,
	}: SearchParamsInterface): Promise<CustomerPaginationServiceInterface> {
		const take = limit;
		const skip = Number(page - 1) * take;

		const customers = await this.repository.findAll({
			skip,
			take,
			order,
			orderBy,
			name,
			email,
			cpf,
			deleted,
		});

		const result = {
			page,
			limit,
			total: customers.length,
			customers,
		};

		if (customers.length === 0) {
			throw new NotFoundError('Customers not found.');
		}

		return result;
	}

	public async save(customer: ICreateCustomer): Promise<ICustomer> {
		const newCustomer = await this.repository.save(customer);

		return newCustomer;
	}

	public async delete(id: string): Promise<ICustomer | null> {
		const customer = await this.repository.findById(id);

		if (!customer) {
			throw new NotFoundError('Customers not found.');
		}

		customer.deleted_at = null;

		const deletedUser = await this.repository.delete(id);

		return deletedUser;
	}

	public async update(id: string, customer: IUpdateCustomer): Promise<void> {
		const customerToUpdate = await this.repository.findActiveCustomerByID(id);

		if (!customerToUpdate) throw new NotFoundError('customer not found');

		if (Object.keys(customerToUpdate).length === 0) {
			throw new ValidationError('one field at least is required for update');
		}

		await this.repository.updateCustomer(id, customer);
	}
}
