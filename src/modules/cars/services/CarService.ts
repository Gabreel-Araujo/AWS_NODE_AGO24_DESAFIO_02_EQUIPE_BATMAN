import { ICarService } from './interfaces/ICarService';
import {
	ICar,
	ICarRepository,
} from '../typeorm/repositories/interfaces/ICarRepository';
import NotFoundError from '@/http/errors/not-found-error';
import { CarsRepository } from '../typeorm/repositories/CarsRepository';
import { Item } from '../typeorm/entities/Items';
import { CarStatus } from '../typeorm/entities/Car';
import { v4 as uuidv4 } from 'uuid';

class CarService implements ICarService {
	private repository: ICarRepository;

	constructor() {
		this.repository = new CarsRepository();
	}

	async findById(id: string): Promise<ICar | null> {
		const car = await this.repository.findById(id);

		if (!car) {
			throw new NotFoundError('Car not found');
		}

		return car;
	}

	async createCar(
		plate: string,
		model: string,
		brand: string,
		km: number,
		year: number,
		items: Item[],
	): Promise<ICar | null> {
		const carExists = this.repository.findByPlateAndStatus;

		if (!carExists) {
			throw new NotFoundError('A car with this plate already exists');
		}

		const newCar: ICar = {
			id: uuidv4(),
			plate,
			brand,
			model,
			km,
			year,
			status: CarStatus.ACTIVE,
			created_at: new Date(),
			updated_at: new Date(),
			items,
		};

		const createdCar = await this.repository.createCar(newCar);

		return createdCar;
	}
}

export default CarService;
