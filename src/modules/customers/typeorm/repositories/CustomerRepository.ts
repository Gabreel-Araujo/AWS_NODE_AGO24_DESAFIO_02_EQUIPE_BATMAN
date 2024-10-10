import { dbConnection } from './../../../../lib/typeorm/index';
import { ICustomersRepository } from './interfaces/ICustomersRepository';
import { DataSource, Repository } from 'typeorm';
import Customer from '../entities/Customer';

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
	public async delete(id: string): Promise<Customer | null> {
        const customer = await this.ormRepository.findOneBy({
            id
        })
       if(!customer) {
        return null
       }
       customer.deleted_at = new Date()
       const updatedCustomer = await this.ormRepository.save(customer)
       return updatedCustomer
    }

}

export default CustomersRepository;
