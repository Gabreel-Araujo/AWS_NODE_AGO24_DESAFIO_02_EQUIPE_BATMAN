import { getCustomRepository } from 'typeorm';
import Customer from '../typeorm/entities/Customer';
import CustomersRepository from '../typeorm/repositories/CustomerRepository';
import { ApiError } from '@/http/errors/api-error';

interface IGetByIdCustomer {
	id: string;
}

class GetByIdCustomerService {
	private customersRepository: CustomersRepository = new CustomersRepository();

	public async execute({ id }: IGetByIdCustomer): Promise<Customer> {
		const customer = await this.customersRepository.findById(id);

		if (!customer) {
			throw new ApiError('Customer not found.', 404);
		}

		return customer;
	}
}

export default GetByIdCustomerService;
