import {
	ICreateCustomer,
	ICustomer,
} from '../typeorm/entities/interfaces/CustomerInterface';
import { ICustomerService } from './interfaces/CustomerServiceInterface';
import NotFoundError from '@/http/errors/not-found-error';
import { ICustomersRepository } from '../typeorm/repositories/interfaces/ICustomersRepository';
import CustomersRepository from '../typeorm/repositories/CustomerRepository';
import { SearchParamsInterface } from './interfaces/SearchParamsInterface';
import ConflictError from '@/http/errors/conflict-error';
import { CustomerPaginationServiceInterface } from './interfaces/CustomerPaginationServiceInterface';

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
			per_page: take,
			total: customers.length,
			current_page: page,
			data: customers,
		};

		if (customers.length === 0) {
			throw new NotFoundError('Customers not found.');
		}

		return result;
	}

	public async save(customer: ICreateCustomer): Promise<ICustomer> {
		const alreadyExistsEmail = await this.repository.findActiveCustomerByEmail(
			customer.email,
		);

		if (alreadyExistsEmail) {
			throw new ConflictError('email already exist');
		}

		const alreadyExistsCPF = await this.repository.findCustomerByCPF(
			customer.cpf,
		);

		if (alreadyExistsCPF) {
			throw new ConflictError('cpf already exist');
		}

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
}
