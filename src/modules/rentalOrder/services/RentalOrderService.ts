import { ICustomersRepository } from '@/modules/customers/typeorm/repositories/interfaces/ICustomersRepository';
import { ICreateRentalOrder } from '../typeorm/entities/interfaces/RentalOrderInterface';
import { IRentalOrderRepository } from '../typeorm/repositories/interfaces/IRentalOrderRepository';
import RentalOrderRepository from '../typeorm/repositories/RentalOrderRepository';
import { IRentalOrderService } from './interfaces/RentalOrderServiceInterface';
import CustomersRepository from '@/modules/customers/typeorm/repositories/CustomerRepository';
import { ICarRepository } from '@/modules/cars/typeorm/repositories/interfaces/ICarRepository';
import { CarsRepository } from '@/modules/cars/typeorm/repositories/CarsRepository';
import NotFoundError from '@/http/errors/not-found-error';
import { ApiError } from '@/http/errors/api-error';
import RentalOrder from '../typeorm/entities/RentalOrder';

export default class RentalOrderService implements IRentalOrderService {
	private repository: IRentalOrderRepository;
	private customerRepository: ICustomersRepository;
	private carRepository: ICarRepository;

	constructor() {
		this.repository = new RentalOrderRepository();
		this.customerRepository = new CustomersRepository();
		this.carRepository = new CarsRepository();
	}

	public async create(order: ICreateRentalOrder): Promise<RentalOrder> {
		const customer = await this.customerRepository.findById(order.customer_id);
		const car = await this.carRepository.findById(order.car_id);
		const carOrders = await this.repository.findOrderStatusByCar(order.car_id);
		const customerOrders = await this.repository.findOrderStatusByCustomer(
			order.customer_id,
		);

		if (!customer) {
			throw new NotFoundError('Customer not found.');
		}

		if (!car) {
			throw new NotFoundError('Car not found.');
		}

		if (carOrders) {
			throw new ApiError('Car cant be used. It is already in use', 400);
		}

		if (customerOrders) {
			throw new ApiError(
				'Cant create order because customer has an opened order already',
				400,
			);
		}

		const newOrder = await this.repository.save(order);

		return newOrder;
	}
}
