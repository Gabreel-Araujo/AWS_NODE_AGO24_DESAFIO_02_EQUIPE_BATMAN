import { dbConnection } from './../../../../lib/typeorm/index';
import { ICustomersRepository } from './interfaces/ICustomersRepository';
import { Repository } from 'typeorm';
import Customer from '../entities/Customer';
import { SearchParams } from './interfaces/ICustomersRepository';
import { ICustomerPagination } from './interfaces/ICustomerPagination';

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
		page,
		skip,
		take,
	}: SearchParams): Promise<ICustomerPagination> {
		const [customers, count,] = await this.ormRepository
			.createQueryBuilder()
			.skip(skip)
			.take(take)
			.getManyAndCount();

		const result = {
			per_page: take,
    		total: count,
    		current_page: page,
    		data: customers,
		}

		return result;
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
