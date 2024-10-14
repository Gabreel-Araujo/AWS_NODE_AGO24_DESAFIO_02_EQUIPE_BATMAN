import { ICarService } from './interfaces/ICarService';
import {
	ICar,
	ICarRepository,
} from '../typeorm/repositories/interfaces/ICarRepository';
import NotFoundError from '@/http/errors/not-found-error';
import { CarsRepository } from '../typeorm/repositories/CarsRepository';
import { Item } from '../typeorm/entities/Items';
import { CarStatus } from '../typeorm/entities/Car';
import { randomUUID } from 'node:crypto';

class CarService implements ICarService {
	private repository: ICarRepository;

	constructor() {
		this.repository = new CarsRepository();
	}
	async createCar(
		plate: string,
		brand: string,
		model: string,
		year: number,
		daily_price: number,
		km: number,
		items: Item[],
	): Promise<ICar | null> {
		const carExists = await this.repository.findByPlateAndStatus(
			plate,
			CarStatus.ACTIVE,
		);

		if (carExists) {
			throw new NotFoundError('A car with this plate already exists');
		}

		const newCar: ICar = {
			plate,
			brand,
			model,
			km,
			daily_price,
			year,
			status: CarStatus.ACTIVE,
			created_at: new Date(),
			updated_at: new Date(),
		};

		const createdCar = await this.repository.save(newCar);

		await this.createCarItems(createdCar, items);

		return createdCar;
	}

	async findById(id: string): Promise<ICar | null> {
		const car = await this.repository.findById(id);

		if (!car) {
			throw new NotFoundError('Car not found');
		}

		return car;
	}

	async createCarItems(car: ICar, items: Item[]): Promise<void> {
		const newItems = items.map((item) => {
			const itemName = item;
			return {
				id: randomUUID(),
				car: car,
				item: itemName,
			};
		});

		await this.repository.createCarItems(newItems);
	}
}

export default CarService;
