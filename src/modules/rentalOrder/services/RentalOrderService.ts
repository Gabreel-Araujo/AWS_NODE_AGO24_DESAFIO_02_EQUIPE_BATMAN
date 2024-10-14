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

			if (rentalOrder.closing_date && car) {
				const lateFee = this.calculateLateFee(
					rentalOrder.closing_date,
					car.daily_price,
				);
				order.late_fee = lateFee;
			}

			const { total, lateFee } = this.calculateTotal(
				rentalOrder,
				order.closing_date,
				car as Cars,
			);

			order.total = total;
			order.late_fee = lateFee;

			console.log(order);
		}

		return await this.repository.update(id, order);
	}

	private calculateLateFee(
		endDate: Date,
		closingDate: Date,
		dailyPrice: number,
	) {
		const lateDays = differenceInDays(closingDate, endDate);
		return lateDays > 0 ? lateDays * (2 * dailyPrice) : 0;
	}

	private calculateTotal(
		order: RentalOrder,
		closingDate: Date | undefined,
		car: Cars,
	) {
		const startDate = new Date(order.start_date);
		const endDate: Date = new Date(order.end_date);
		let lateFee = 0;

		if (order.end_date !== closingDate) {
			if (!closingDate) return;
			lateFee = this.calculateLateFee(endDate, closingDate, car.daily_price);
		}

		if (Number.isNaN(endDate.getTime())) {
			throw new Error('Invalid end date or cancellation date');
		}
		const rentalDays = differenceInDays(endDate, startDate);

		return {
			total:
				Number(car.daily_price) * Number(rentalDays) +
				Number(order.rental_rate) +
				Number(lateFee),
			lateFee,
		};
	}
}
