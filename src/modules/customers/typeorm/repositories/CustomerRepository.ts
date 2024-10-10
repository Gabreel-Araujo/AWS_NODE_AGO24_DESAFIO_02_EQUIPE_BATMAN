import { dbConnection } from './../../../../lib/typeorm/index';
import { ICustomersRepository } from './interfaces/ICustomersRepository';
import { DataSource, IsNull, Repository, UpdateResult } from 'typeorm';
import Customer from '../entities/Customer';
import {
	ICreateCustomer,
	ICustomer,
	IUpdateCustomer,
} from '../entities/interfaces/CustomerInterface';
import NotFoundError from '@/http/errors/not-found-error';

class CustomersRepository implements ICustomersRepository {
	private ormRepository: Repository<Customer>;

	constructor() {
		this.ormRepository = dbConnection.getRepository(Customer);
	}

	public async findById(id: string): Promise<Customer | null> {
		const customer = await this.ormRepository.findOne({
			where: {
				id,
			},
		});

		if (!customer) {
			return null;
		}

		return customer;
	}

	public async save(customer: ICreateCustomer) {
		const createdCustomer = this.ormRepository.create(customer);
		return await this.ormRepository.save(createdCustomer);
	}

	public async findActiveCustomerByEmail(
		email: string,
	): Promise<ICustomer | null> {
		return await this.ormRepository.findOne({
			where: { email, deleted_at: IsNull() },
		});
	}

	public async findCustomerByCPF(cpf: string): Promise<ICustomer | null> {
		return await this.ormRepository.findOne({
			where: { cpf },
		});
	}

	public async findActiveCustomerByID(id: string): Promise<ICustomer | null> {
		return await this.ormRepository.findOne({
			where: { id, deleted_at: IsNull() },
		});
	}

	public async updateCustomer(
		id: string,
		customer: IUpdateCustomer,
	): Promise<UpdateResult> {
		return await this.ormRepository.update(id, customer);
	}
}

export default CustomersRepository;
