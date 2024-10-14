import { dbConnection } from '@/lib/typeorm';
import { In, Repository } from 'typeorm';
import {
	ICreateRentalOrder,
	IRentalOrder,
} from '../entities/interfaces/RentalOrderInterface';
import RentalOrder from '../entities/RentalOrder';
import { IRentalOrderRepository } from './interfaces/IRentalOrderRepository';

class RentalOrderRepository implements IRentalOrderRepository {
	private ormRepository: Repository<RentalOrder>;

	constructor() {
		this.ormRepository = dbConnection.getRepository(RentalOrder);
	}
	public async findByCustomer(
		customer_id: string,
	): Promise<RentalOrder | null> {
		const customer = await this.ormRepository.findOne({
			where: { customer_id, status: In(['open']) },
		});
		return customer;
	}
	public async findByCar(car_id: string): Promise<RentalOrder | null> {
		const car = await this.ormRepository.findOne({
			where: { car_id, status: In(['open', 'aproved']) },
		});
		return car;
	}
	public async findById(id: string): Promise<RentalOrder | null> {
		const rentalOrder = await this.ormRepository.findOne({
			where: { id },
		});
		return rentalOrder;
	}
	public async save(order: ICreateRentalOrder): Promise<RentalOrder> {
		const rentalOrder = this.ormRepository.create(order);
		await this.ormRepository.save(rentalOrder);
		return rentalOrder;
	}

	public async findActiveOrdersByCarId(carId: string): Promise<boolean> {
		const activeOrders = await this.ormRepository.find({
			where: {
				car_id: carId,
				status: In(['open', 'aproved']),
			},
		});
		return activeOrders.length > 0;
	}
}

export default RentalOrderRepository;
