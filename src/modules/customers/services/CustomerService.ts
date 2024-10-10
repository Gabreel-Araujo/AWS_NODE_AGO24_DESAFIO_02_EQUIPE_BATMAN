import {
	ICreateCustomer,
	ICustomer,
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
		const alreadyExistsEmail = await this.repository.findActiveCustomerByEmail(
			customer.email,
		);
		if (alreadyExistsEmail) throw new ConflictError('email already exist');

		const alreadyExistsCPF = await this.repository.findCustomerByCPF(
			customer.cpf,
		);
		if (alreadyExistsCPF) throw new ConflictError('cpf already exist');

		return await this.repository.save(customer);
	}
}
