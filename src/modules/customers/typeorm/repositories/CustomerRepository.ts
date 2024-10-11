import { dbConnection } from './../../../../lib/typeorm/index';
import { ICustomersRepository } from './interfaces/ICustomersRepository';
import { IsNull, Repository } from 'typeorm';
import Customer from '../entities/Customer';
import {
	ICreateCustomer,
	ICustomer,
} from '../entities/interfaces/CustomerInterface';
import ConflictError from '@/http/errors/conflict-error';

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
		try {
			const createdCustomer = this.ormRepository.create(customer);

			return await this.ormRepository.save(createdCustomer);
		} catch (error: any) {
			// Código de erro específico para violação de chave única
			if (error.code === '23505') {
				throw new ConflictError('email or cpf already exists');
			}
			throw error;
		}
	}

	public async findActiveCustomerByEmail(
		email: string,
	): Promise<ICustomer | null> {
		const customer = await this.ormRepository.findOne({
			where: { email, deleted_at: IsNull() },
		});

		return customer;
	}

	public async findCustomerByCPF(cpf: string): Promise<ICustomer | null> {
		const customer = await this.ormRepository.findOne({
			where: { cpf },
		});

		return customer;
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
}

export default CustomersRepository;
