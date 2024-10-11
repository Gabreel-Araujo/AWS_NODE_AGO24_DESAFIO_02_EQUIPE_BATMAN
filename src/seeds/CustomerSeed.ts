import { DataSource } from 'typeorm';
import Customer from '@/modules/customers/typeorm/entities/Customer';

export const CustomerSeed = async (dataSource: DataSource) => {
	const customerRepository = dataSource.getRepository(Customer);

	const existingCustomer = await customerRepository.findOneBy({
		email: 'customertest@mail.com',
	});

	const newCustomer = {
		name: 'Customer Test',
		birth: '1999-09-18',
		email: 'customertest@mail.com',
		cpf: '01234567891',
		phone_number: '48999117156',
	};

	if (!existingCustomer) {
		const customer = customerRepository.create(newCustomer);

		await customerRepository.save(customer);
		console.log(`Cliente teste criado com sucesso! ID: ${customer.id}`);
	} else {
		console.log('Cliente teste já existe.');
	}
};
