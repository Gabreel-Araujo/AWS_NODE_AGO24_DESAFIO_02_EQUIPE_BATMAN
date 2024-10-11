import { dbConnection } from './../../../../lib/typeorm/index';
import { ICustomersRepository } from './interfaces/ICustomersRepository';
import { SearchParams } from './interfaces/ICustomersRepository';
import { IsNull, Repository } from 'typeorm';
import Customer from '../entities/Customer';
import {
	ICreateCustomer,
	ICustomer,
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

		if (name) query.andWhere('customer.name LIKE :name', { name: `%${name}%` });
		if (email)
			query.andWhere('customer.email LIKE :email', { email: `%${email}%` });
		if (cpf) query.andWhere('customer.cpf LIKE :cpf', { cpf: { cpf } });
		if (deleted === 'false') query.andWhere('customer.deleted_at IS NULL');
		if (deleted === 'true')
			query.withDeleted().andWhere('customer.deleted_at IS NOT NULL');
		if (!order || (order !== 'DESC' && order !== 'ASC')) {
			order = 'ASC';
		}

		const ordersBy = orderBy?.split(',')

		ordersBy?.map(item => {
			query.addOrderBy(`customer.${item}`, `${order}`);
		})
		const customers = await query.skip(skip).take(take).getMany();

		return customers;
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
}

export default CustomersRepository;
