import ConflictError from '@/http/errors/conflict-error';
import { IsNull, Repository, UpdateResult } from 'typeorm';
import Customer from '../entities/Customer';
import {
	ICreateCustomer,
	ICustomer,
	IUpdateCustomer,
} from '../entities/interfaces/CustomerInterface';
import { dbConnection } from './../../../../lib/typeorm/index';
import { ICustomersRepository } from './interfaces/ICustomersRepository';
import { SearchParams } from './interfaces/ICustomersRepository';

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

	public async findAll({
		skip,
		take,
		orderBy,
		order,
		name,
		email,
		cpf,
		deleted,
	}: SearchParams): Promise<Customer[]> {
		const query = this.ormRepository.createQueryBuilder('customer');

		if (name) {
			query.andWhere('LOWER(customer.name) LIKE LOWER(:name)', {
				name: `%${name}%`,
			});
		}

		if (email) {
			query.andWhere('customer.email LIKE :email', { email: `%${email}%` });
		}

		if (cpf) {
			query.andWhere('customer.cpf LIKE :cpf', { cpf: `%${cpf}%` });
		}

		if (deleted === 'false') {
			query.andWhere('customer.deleted_at IS NULL');
		}

		if (deleted === 'true') {
			query.withDeleted().andWhere('customer.deleted_at IS NOT NULL');
		}

		if (!order || (order !== 'DESC' && order !== 'ASC')) {
			order = 'ASC';
		}

		if (orderBy) {
			const ordersBy = orderBy.split(',');
			for (const item of ordersBy) {
				query.addOrderBy(`customer.${item}`, order);
			}
		} else {
			query.addOrderBy('customer.created_at', order);
		}

		const customers = await query.skip(skip).take(take).getMany();

		return customers;
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

		const updateDeleteCustomer = await this.ormRepository.save(customer);

		return updateDeleteCustomer;
	}

	public async findActiveCustomerByID(id: string): Promise<ICustomer | null> {
		const activeCustomer = await this.ormRepository.findOne({
			where: { id, deleted_at: IsNull() },
		});

		return activeCustomer;
	}

	public async updateCustomer(
		id: string,
		customer: IUpdateCustomer,
	): Promise<UpdateResult> {
		const updatedCustomer = await this.ormRepository.update(id, customer);

		return updatedCustomer;
	}
}

export default CustomersRepository;
