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
import { UpdateResult } from 'typeorm';

export default class RentalOrderService implements IRentalOrderService {
	private repository: IRentalOrderRepository;
	private customerRepository: ICustomersRepository;
	private carRepository: ICarRepository;

	constructor() {
		this.repository = new RentalOrderRepository();
		this.customerRepository = new CustomersRepository();
		this.carRepository = new CarsRepository();
	}

	public async save(order: ICreateRentalOrder): Promise<RentalOrder> {
		const customer = await this.customerRepository.findById(order.customer_id);
		const car = await this.carRepository.findById(order.car_id);
		const carOrders = await this.repository.findByCar(order.car_id);
		const customerOrders = await this.repository.findByCustomer(
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

	public async update(id: string, order: Partial<RentalOrder>) {
		const rentalOrder = await this.repository.findById(id);
		if (!rentalOrder) throw new NotFoundError('order not found');

		if (rentalOrder.status !== 'open' && order.status === 'aproved')
			throw new ApiError('order can only be approved if it is open', 400);

		if (rentalOrder.status !== 'open' && order.status === 'canceled')
			throw new ApiError('order can only be canceled if it is open', 400);

		if (rentalOrder.status !== 'aproved' && order.status === 'closed')
			throw new ApiError('order can only be closed if it is aproved', 400);

		if (
			(order.status === 'closed' || order.status === 'canceled') &&
			order.car_id
		) {
			const car = await this.carRepository.findById(order.car_id);

			if (
				order.status === 'closed' &&
				order.end_date &&
				order.end_date < new Date() &&
				car
			) {
				const actualDate = new Date();
				const lateFee =
					((actualDate.getTime() - order.end_date.getTime()) /
						(1000 * 60 * 60 * 24)) *
					(2 * car.daily_price);
				order.late_fee = lateFee;
			}

			order.total = this.calculateTotal(order as RentalOrder);
		}

		return await this.repository.update(id, order);
	}

	private calculateTotal(order: RentalOrder) {
		const startDate = new Date(order.start_date);
		const endDate =
			order.status === 'closed'
				? new Date(order.end_date)
				: new Date(order.cancellation_date);

		const dateBetweenInDays =
			(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

		return (
			order.car.daily_price * dateBetweenInDays +
			order.rental_rate +
			order.late_fee
		);
	}
}
