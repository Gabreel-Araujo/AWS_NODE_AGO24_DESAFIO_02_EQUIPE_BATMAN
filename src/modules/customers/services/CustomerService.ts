import { ICustomer } from '../typeorm/entities/interfaces/CustomerInterface';
import { ICustomerService } from './interfaces/CustomerServiceInterface';
import NotFoundError from '@/http/errors/not-found-error';
import { ICustomersRepository } from '../typeorm/repositories/interfaces/ICustomersRepository';
import CustomersRepository from '../typeorm/repositories/CustomerRepository';
import { SearchParamsInterface } from './interfaces/SearchParamsInterface';
import { ICustomerPagination } from '../typeorm/repositories/interfaces/ICustomerPagination';

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
		name,
		email,
		cpf,
		deleted,
	}: SearchParamsInterface): Promise<ICustomerPagination> {
		const take = limit;
		const skip = Number(page - 1) * take;

		const customers = await this.repository.findAll({
			page,
			skip,
			take,
			name,
			email,
			cpf,
			deleted,
		});
		return customers;
	}

	public async delete(id: string): Promise<void> {
		const customer = await this.repository.findById(id);
		if (!customer) {
			throw new NotFoundError('Customer not found.');
		}
		customer.deleted_at = null;
		await this.repository.delete(id);
	}
}
