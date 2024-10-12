import { Repository } from 'typeorm';
import { Cars, CarStatus } from '../entities/Car';
import { Item } from '../entities/Items';
import { dbConnection } from '@/lib/typeorm';
import { ICar, ICarRepository } from './interfaces/ICarRepository';

export class CarsRepository implements ICarRepository {
	private ormRepository: Repository<Cars>;
	private itemRepository: Repository<Item>;

	constructor() {
		this.ormRepository = dbConnection.getRepository(Cars);
	}

	async findById(id: string): Promise<ICar | null> {
		const car = await this.ormRepository.findOne({
			where: {
				id,
			},
		});
		if (!car) {
			return null;
		}

		return car;
	}

	async findByPlateAndStatus(
		plate: string,
		status: CarStatus,
	): Promise<ICar | null> {
		const carExists = await this.ormRepository.findOne({
			where: {
				plate,
				status,
			},
		});
		if (!carExists) {
			return null;
		}
		return carExists;
	}

	async createCar(car: ICar): Promise<ICar> {
		const newCar = this.ormRepository.create(car);
		const createdCar = await this.ormRepository.save(newCar);

		return createdCar;
	}

	async createCarItems(
		items: { carId: string; item: string; id: string }[],
	): Promise<void> {
		const newItems = await this.itemRepository.create(items);
		await this.itemRepository.save(newItems);
	}
}
