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
import { differenceInDays } from 'date-fns';
import Cars from '@/modules/cars/typeorm/entities/Car';

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
			rentalOrder.car_id
		) {
			const car = await this.carRepository.findById(rentalOrder.car_id);

			if (!car) throw new NotFoundError('car not found');

			if (rentalOrder.end_date && car) {
				const lateFee = this.calculateLateFee(
					rentalOrder.end_date,
					car.daily_price,
				);
				order.late_fee = lateFee;
			}

			order.total = this.calculateTotal(rentalOrder, car as Cars);
		}

		return await this.repository.update(id, order);
	}

	private calculateLateFee(endDate: Date, dailyPrice: number) {
		const actualDate = new Date();
		const lateDays = differenceInDays(actualDate, endDate);
		return lateDays > 0 ? lateDays * (2 * dailyPrice) : 0;
	}

	private calculateTotal(order: RentalOrder, car: Cars) {
		const startDate = new Date(order.start_date);
		let endDate: Date;

		if (order.status === 'closed') {
			endDate = new Date(order.end_date);
		} else {
			endDate = new Date(order.end_date);
		}
		
		if (Number.isNaN(endDate.getTime())) {
			throw new Error('Invalid end date or cancellation date');
		}
		const rentalDays = differenceInDays(endDate, startDate);

		return (
			Number(car.daily_price) * Number(rentalDays) +
			Number(order.rental_rate) +
			(Number(order.late_fee) ?? 0)
		);
	}
}
