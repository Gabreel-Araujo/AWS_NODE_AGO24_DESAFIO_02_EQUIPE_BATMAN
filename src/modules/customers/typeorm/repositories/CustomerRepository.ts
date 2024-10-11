import { dbConnection } from './../../../../lib/typeorm/index';
import { ICustomersRepository } from './interfaces/ICustomersRepository';
import { IsNull, Repository, UpdateResult } from 'typeorm';
import Customer from '../entities/Customer';
import {
	ICreateCustomer,
	ICustomer,
	IUpdateCustomer,
} from '../entities/interfaces/CustomerInterface';
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
		const user = await this.ormRepository.findOne({
			where: { email, deleted_at: IsNull() },
		});

		return user;
	}

	public async findCustomerByCPF(cpf: string): Promise<ICustomer | null> {
		const user = await this.ormRepository.findOne({
			where: { cpf },
		});

		return user;
	}

	public async delete(id: string): Promise<Customer | null> {
		const customer = await this.ormRepository.findOneBy({
			id,
		});

		if (!customer) {
			return null;
		}

		customer.deleted_at = new Date();

		const updatedCustomer = await this.ormRepository.save(customer);

		return updatedCustomer;
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
